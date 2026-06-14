import { getSupabase } from '../lib/supabase';
import type { Product } from '../types';
import { mockProducts } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';

// Rows as returned by the joined Supabase query below.
interface ProductWithRelations {
  id: string;
  store_id: string;
  shopify_id: string;
  title: string;
  handle: string;
  vendor: string | null;
  product_type: string | null;
  tags: string[] | null;
  price: number;
  compare_at_price: number | null;
  status: string;
  updated_at: string;
  product_images: { src: string; is_primary: boolean; position: number | null }[] | null;
  generated_images: { status: string; updated_at: string }[] | null;
}

const PRODUCT_SELECT = `
  id, store_id, shopify_id, title, handle, vendor, product_type, tags,
  price, compare_at_price, status, updated_at,
  product_images ( src, is_primary, position ),
  generated_images ( status, updated_at )
`;

function computeDiscount(price: number, compareAt: number | null): number | undefined {
  if (!compareAt || compareAt <= price) return undefined;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

function pickPrimaryImage(images: ProductWithRelations['product_images']): string {
  if (!images || images.length === 0) return '';
  const primary = images.find((i) => i.is_primary);
  if (primary) return primary.src;
  return [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0))[0].src;
}

function mapStatus(status: string): Product['status'] {
  if (status === 'draft') return 'draft';
  if (status === 'archived') return 'archived';
  return 'active';
}

/**
 * Creative status is derived from the product's generated_images rows:
 * a completed render means a creative exists; otherwise we surface the most
 * relevant in-flight / failed state, falling back to "none".
 */
function deriveCreativeStatus(
  generated: ProductWithRelations['generated_images'],
): Product['creativeStatus'] {
  if (!generated || generated.length === 0) return 'none';
  if (generated.some((g) => g.status === 'completed')) return 'generated';
  if (generated.some((g) => g.status === 'failed')) return 'failed';
  if (generated.some((g) => g.status === 'pending' || g.status === 'processing')) return 'pending';
  return 'none';
}

/**
 * Feed status proxy. The schema has no per-product Meta feed-sync column yet
 * (the feed endpoint emits a generated creative when one is `completed`), so
 * we mirror the creative state: a completed creative is what gets published.
 * Replace this once a real feed-sync table exists.
 */
function deriveFeedStatus(creativeStatus: Product['creativeStatus']): Product['feedStatus'] {
  switch (creativeStatus) {
    case 'generated':
      return 'synced';
    case 'pending':
      return 'pending';
    case 'failed':
      return 'error';
    default:
      return 'not_synced';
  }
}

function mapProduct(row: ProductWithRelations): Product {
  const creativeStatus = deriveCreativeStatus(row.generated_images);
  return {
    id: row.id,
    storeId: row.store_id,
    sku: row.shopify_id, // schema has no SKU column; Shopify product id stands in
    name: row.title,
    image: pickPrimaryImage(row.product_images),
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    discount: computeDiscount(row.price, row.compare_at_price),
    status: mapStatus(row.status),
    creativeStatus,
    feedStatus: deriveFeedStatus(creativeStatus),
    tags: row.tags ?? [],
    collection: row.product_type || 'Uncategorized',
    lastUpdated: new Date(row.updated_at),
  };
}

/**
 * Fetch products for the signed-in user's stores. Returns mapped UI products
 * plus the data source. When Supabase isn't configured, returns demo data so
 * the screen stays populated and obviously-demo.
 */
export async function fetchProducts(): Promise<{ data: Product[]; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: mockProducts, source: 'demo' };
  }

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .order('updated_at', { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  const products = (data as unknown as ProductWithRelations[]).map(mapProduct);
  return { data: products, source: 'live' };
}
