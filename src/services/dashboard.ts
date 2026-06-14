import { getSupabase } from '../lib/supabase';
import type { DataSource } from '../hooks/useAsyncData';
import { storesRepo, type Store } from '../repositories';

// Re-export from repositories for backward compatibility
export { fetchStores } from './stores-reexport';

export interface DashboardStats {
  primaryStore: { name: string; productsCount: number } | null;
  storesConnected: number;
  productsSynced: number;
  creativesGenerated: number;
  metaUpdates: number;
  successRate: number;
  processing: number;
  queued: number;
  failed: number;
  lastSync: Date | null;
}

/**
 * Aggregate dashboard metrics from real tables.
 * Falls back to empty/demo data when backend is unconfigured.
 */
export async function fetchDashboardStats(): Promise<{ data: DashboardStats; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      data: {
        primaryStore: null,
        storesConnected: 0,
        productsSynced: 0,
        creativesGenerated: 0,
        metaUpdates: 0,
        successRate: 100,
        processing: 0,
        queued: 0,
        failed: 0,
        lastSync: null,
      },
      source: 'demo',
    };
  }

  // Fetch counts in parallel
  const [
    storesRes,
    productsSynced,
    completed,
    processing,
    queued,
    failed,
  ] = await Promise.all([
    supabase.from('stores').select('id, shop_name, shop_domain, last_synced_at, is_active').order('installed_at', { ascending: false }),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
    supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
  ]);

  if (storesRes.error) throw new Error(storesRes.error.message);

  const stores = storesRes.data ?? [];
  const first = stores[0];

  // Get product count for primary store
  let primaryStoreProducts = productsSynced.count ?? 0;
  if (first) {
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', first.id);
    primaryStoreProducts = count ?? primaryStoreProducts;
  }

  const totalTerminal = (completed.count ?? 0) + (failed.count ?? 0);
  const successRate = totalTerminal > 0 ? Math.round(((completed.count ?? 0) / totalTerminal) * 1000) / 10 : 100;

  return {
    data: {
      primaryStore: first
        ? { name: first.shop_name || first.shop_domain, productsCount: primaryStoreProducts }
        : null,
      storesConnected: stores.length,
      productsSynced: productsSynced.count ?? 0,
      creativesGenerated: completed.count ?? 0,
      metaUpdates: completed.count ?? 0,
      successRate,
      processing: processing.count ?? 0,
      queued: queued.count ?? 0,
      failed: failed.count ?? 0,
      lastSync: first?.last_synced_at ? new Date(first.last_synced_at) : null,
    },
    source: 'live',
  };
}
