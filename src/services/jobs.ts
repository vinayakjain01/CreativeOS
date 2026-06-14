import { getSupabase } from '../lib/supabase';
import type { GenerationJob } from '../types';
import { mockGenerationJobs } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';
import { apiPost } from '../lib/api';

interface JobRow {
  id: string;
  product_id: string;
  status: string;
  progress: number | null;
  error: string | null;
  started_at: string | null;
  completed_at: string | null;
  products: { title: string } | { title: string }[] | null;
  templates: { name: string } | { name: string }[] | null;
}

function rel<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

function mapStatus(s: string): GenerationJob['status'] {
  return s === 'processing' || s === 'completed' || s === 'failed' ? s : 'queued';
}

function mapJob(row: JobRow): GenerationJob {
  return {
    id: row.id,
    productId: row.product_id,
    productName: rel(row.products)?.title ?? 'Product',
    template: rel(row.templates)?.name ?? 'Auto',
    status: mapStatus(row.status),
    progress: row.progress ?? 0,
    startedAt: row.started_at ? new Date(row.started_at) : undefined,
    completedAt: row.completed_at ? new Date(row.completed_at) : undefined,
    error: row.error ?? undefined,
  };
}

/** Fetch generation jobs (RLS-scoped). Demo fallback when unconfigured. */
export async function fetchJobs(): Promise<{ data: GenerationJob[]; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: mockGenerationJobs, source: 'demo' };
  }

  const { data, error } = await supabase
    .from('generation_jobs')
    .select('id, product_id, status, progress, error, started_at, completed_at, products(title), templates(name)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  return { data: (data as unknown as JobRow[]).map(mapJob), source: 'live' };
}

export interface EnqueueOptions {
  storeId: string;
  productIds?: string[];
  filter?: { type: 'all' | 'tag' | 'vendor' | 'product_type'; value?: string };
}

/** Enqueue generation on the backend (BullMQ when Redis is present, else inline). */
export async function enqueueGeneration(
  opts: EnqueueOptions,
): Promise<{ enqueued: number; mode: 'queue' | 'inline' }> {
  return apiPost('/api/generate/queue', opts);
}

/**
 * Enqueue generation for a set of products, grouped by their owning store
 * (the backend endpoint is per-store). Returns the total number enqueued.
 */
export async function enqueueForProducts(
  products: { id: string; storeId?: string }[],
): Promise<{ enqueued: number }> {
  const byStore = new Map<string, string[]>();
  for (const p of products) {
    if (!p.storeId) continue;
    const list = byStore.get(p.storeId) ?? [];
    list.push(p.id);
    byStore.set(p.storeId, list);
  }
  if (byStore.size === 0) throw new Error('No store associated with these products');

  let enqueued = 0;
  for (const [storeId, productIds] of byStore) {
    const res = await enqueueGeneration({ storeId, productIds });
    enqueued += res.enqueued;
  }
  return { enqueued };
}

/** Enqueue generation for every active product across the given stores. */
export async function enqueueAllForStores(storeIds: string[]): Promise<{ enqueued: number }> {
  if (storeIds.length === 0) throw new Error('No stores connected');
  let enqueued = 0;
  for (const storeId of storeIds) {
    const res = await enqueueGeneration({ storeId, filter: { type: 'all' } });
    enqueued += res.enqueued;
  }
  return { enqueued };
}
