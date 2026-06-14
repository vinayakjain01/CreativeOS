// ──────────────────────────────────────────────────────────────────────────
// Database row types
//
// Hand-written to mirror the Postgres schema that CatalogStudio owns. These
// are intentionally a SUBSET — only the columns CreativeOS reads today — and
// will be regenerated from the live schema (`supabase gen types`) once the
// projects share one source repo. Until then, keep this in sync with the
// CatalogStudio writers (sync route, generate route, OAuth callback).
// ──────────────────────────────────────────────────────────────────────────

export interface StoreRow {
  id: string;
  user_id: string;
  shop_domain: string;
  shop_name: string | null;
  shop_email: string | null;
  currency: string | null;
  is_active: boolean;
  installed_at: string | null;
  last_synced_at: string | null;
}

export interface ProductRow {
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
  inventory_quantity: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  src: string;
  alt: string | null;
  position: number | null;
  is_primary: boolean;
}

export interface GeneratedImageRow {
  id: string;
  product_id: string;
  template_id: string;
  generated_url: string | null;
  status: string;
  updated_at: string;
}

/**
 * Minimal shape consumed by the Supabase client generics. Only the tables and
 * columns CreativeOS reads are declared; everything else is left open.
 */
export interface Database {
  public: {
    Tables: {
      stores: { Row: StoreRow };
      products: { Row: ProductRow };
      product_images: { Row: ProductImageRow };
      generated_images: { Row: GeneratedImageRow };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
