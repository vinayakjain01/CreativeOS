import { getSupabase } from '../lib/supabase';
import type { Store } from '../types';
import { mockStores } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';
import type { StoreRow } from '../lib/database.types';

/**
 * Health is a coarse proxy until a real signal exists: a store synced within
 * the last 24h is healthy; staler syncs degrade; never-synced is low.
 */
function deriveHealth(row: StoreRow): number {
  if (!row.is_active) return 40;
  if (!row.last_synced_at) return 60;
  const ageHours = (Date.now() - new Date(row.last_synced_at).getTime()) / 3_600_000;
  if (ageHours <= 24) return 98;
  if (ageHours <= 24 * 7) return 85;
  return 70;
}

function mapStore(row: StoreRow, productsCount: number): Store {
  return {
    id: row.id,
    name: row.shop_name || row.shop_domain,
    domain: row.shop_domain,
    platform: 'shopify',
    status: row.is_active ? 'connected' : 'disconnected',
    productsCount,
    lastSync: new Date(row.last_synced_at || row.installed_at || Date.now()),
    healthScore: deriveHealth(row),
  };
}

/**
 * Fetch the signed-in user's connected stores with per-store product counts.
 * Falls back to demo data when the backend is unconfigured.
 */
export async function fetchStores(): Promise<{ data: Store[]; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: mockStores, source: 'demo' };
  }

  const { data, error } = await supabase
    .from('stores')
    .select('id, user_id, shop_domain, shop_name, shop_email, currency, is_active, installed_at, last_synced_at')
    .order('installed_at', { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data as StoreRow[]) ?? [];

  // Per-store product counts (stores are few; run in parallel).
  const counts = await Promise.all(
    rows.map(async (row) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('store_id', row.id);
      return count ?? 0;
    }),
  );

  return { data: rows.map((row, i) => mapStore(row, counts[i])), source: 'live' };
}
