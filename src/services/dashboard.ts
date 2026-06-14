import { getSupabase } from '../lib/supabase';
import type { DataSource } from '../hooks/useAsyncData';
import { mockStores, mockAnalytics, mockGenerationJobs } from '../data/mockData';

export interface DashboardStats {
  primaryStore: { name: string; productsCount: number } | null;
  storesConnected: number;
  productsSynced: number;
  creativesGenerated: number;
  /** Proxy: completed creatives published downstream (no Meta-updates table yet). */
  metaUpdates: number;
  successRate: number;
  processing: number;
  queued: number;
  failed: number;
  lastSync: Date | null;
}

async function countWhere(
  supabase: NonNullable<ReturnType<typeof getSupabase>>,
  table: 'products' | 'generated_images',
  build?: (q: any) => any,
): Promise<number> {
  const base = supabase.from(table).select('id', { count: 'exact', head: true });
  const query = build ? build(base) : base;
  const { count } = await query;
  return count ?? 0;
}

function demoStats(): DashboardStats {
  const processing = mockGenerationJobs.filter((j) => j.status === 'processing').length;
  const queued = mockGenerationJobs.filter((j) => j.status === 'queued').length;
  const failed = mockGenerationJobs.filter((j) => j.status === 'failed').length;
  const store = mockStores[0];
  return {
    primaryStore: store ? { name: store.name, productsCount: store.productsCount } : null,
    storesConnected: mockStores.length,
    productsSynced: mockAnalytics.productsSynced,
    creativesGenerated: mockAnalytics.creativesGenerated,
    metaUpdates: mockAnalytics.metaUpdates,
    successRate: mockAnalytics.automationSuccessRate,
    processing,
    queued,
    failed,
    lastSync: store ? store.lastSync : null,
  };
}

/**
 * Aggregate top-line dashboard metrics from real tables (counts only — cheap
 * head queries, all RLS-scoped to the signed-in user). Falls back to demo
 * figures when the backend is unconfigured.
 */
export async function fetchDashboardStats(): Promise<{ data: DashboardStats; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: demoStats(), source: 'demo' };
  }

  const [storesRes, productsSynced, completed, processing, queued, failed] = await Promise.all([
    supabase
      .from('stores')
      .select('id, shop_name, shop_domain, last_synced_at, is_active')
      .order('installed_at', { ascending: false }),
    countWhere(supabase, 'products'),
    countWhere(supabase, 'generated_images', (q) => q.eq('status', 'completed')),
    countWhere(supabase, 'generated_images', (q) => q.eq('status', 'processing')),
    countWhere(supabase, 'generated_images', (q) => q.eq('status', 'pending')),
    countWhere(supabase, 'generated_images', (q) => q.eq('status', 'failed')),
  ]);

  if (storesRes.error) throw new Error(storesRes.error.message);
  const stores = (storesRes.data ?? []) as Array<{
    id: string;
    shop_name: string | null;
    shop_domain: string;
    last_synced_at: string | null;
    is_active: boolean;
  }>;
  const first = stores[0];

  // Product count for the primary store (scopes the hero "Products" figure).
  let primaryStoreProducts = productsSynced;
  if (first) {
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', first.id);
    primaryStoreProducts = count ?? productsSynced;
  }

  const totalTerminal = completed + failed;
  const successRate = totalTerminal > 0 ? Math.round((completed / totalTerminal) * 1000) / 10 : 100;

  return {
    data: {
      primaryStore: first
        ? { name: first.shop_name || first.shop_domain, productsCount: primaryStoreProducts }
        : null,
      storesConnected: stores.length,
      productsSynced,
      creativesGenerated: completed,
      metaUpdates: completed,
      successRate,
      processing,
      queued,
      failed,
      lastSync: first?.last_synced_at ? new Date(first.last_synced_at) : null,
    },
    source: 'live',
  };
}
