import { getSupabase } from '../lib/supabase';
import type { GenerationJob } from '../types';
import { mockGenerationJobs } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';
import { apiPost } from '../lib/api';

// Re-export GenerationJob type
export type { GenerationJob };

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

  // Try generation_jobs table first, fall back to generated_images
  const { data: jobsData, error: jobsError } = await supabase
    .from('generation_jobs')
    .select('id, product_id, status, progress, error, started_at, completed_at, products(title), templates(name)')
    .order('created_at', { ascending: false })
    .limit(200);

  if (!jobsError && jobsData) {
    return { data: (jobsData as unknown as JobRow[]).map(mapJob), source: 'live' };
  }

  // Fall back to generated_images table
  const { data, error } = await supabase
    .from('generated_images')
    .select('id, product_id, status, products(title), templates(name), created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) throw new Error(error.message);

  const mappedJobs: GenerationJob[] = (data ?? []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    productId: row.product_id as string,
    productName: (row.products as { title: string })?.title ?? 'Product',
    template: (row.templates as { name: string })?.name ?? 'Auto',
    status: mapStatus(row.status as string),
    progress: row.status === 'completed' ? 100 : row.status === 'processing' ? 50 : 0,
    startedAt: row.created_at ? new Date(row.created_at as string) : undefined,
    completedAt: row.status === 'completed' && row.updated_at ? new Date(row.updated_at as string) : undefined,
    error: undefined,
  }));

  return { data: mappedJobs, source: 'live' };
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
