// ──────────────────────────────────────────────────────────────────────────
// Database row types - Generated from Postgres schema
// ──────────────────────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

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
  products_count: number;
  health_score: number;
  feed_token: string | null;
  storefront_url: string | null;
}

export interface ProductRow {
  id: string;
  store_id: string;
  shopify_id: string;
  sku: string | null;
  title: string;
  handle: string | null;
  vendor: string | null;
  product_type: string | null;
  collection: string | null;
  tags: string[] | null;
  image_url: string | null;
  price: number | null;
  compare_at_price: number | null;
  discount_percent: number | null;
  inventory_quantity: number | null;
  status: string;
  creative_status: string;
  feed_status: string;
  last_creative_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductImageRow {
  id: string;
  product_id: string;
  shopify_image_id: string | null;
  src: string;
  alt: string | null;
  position: number | null;
  is_primary: boolean | null;
  created_at: string;
}

export interface TemplateRow {
  id: string;
  user_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  canvas_data: Record<string, unknown>;
  thumbnail_url: string | null;
  is_active: boolean | null;
  usage_count: number;
  category: string;
  performance_ctr: number | null;
  performance_conversions: number | null;
  created_at: string;
  updated_at: string;
}

export interface TemplateCategoryRow {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface TemplateRuleRow {
  id: string;
  user_id: string;
  store_id: string;
  template_id: string;
  rule_type: string;
  rule_operator: string;
  rule_value: string;
  priority: number | null;
  is_active: boolean | null;
  created_at: string;
}

export interface GeneratedImageRow {
  id: string;
  product_id: string;
  product_image_id: string | null;
  template_id: string | null;
  cloudinary_public_id: string | null;
  generated_url: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SyncLogRow {
  id: string;
  store_id: string;
  sync_type: string;
  status: string;
  products_synced: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface InsightRow {
  id: string;
  user_id: string;
  store_id: string | null;
  insight_type: 'info' | 'warning' | 'success' | 'action';
  title: string;
  description: string | null;
  action_label: string | null;
  action_href: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  priority: number;
  created_at: string;
  expires_at: string | null;
}

export interface ActivityRow {
  id: string;
  user_id: string;
  store_id: string | null;
  activity_type: 'product_sync' | 'creative_generated' | 'feed_refresh' | 'meta_sync' | 'rule_applied' | 'template_applied';
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface MetaCatalogRow {
  id: string;
  user_id: string;
  store_id: string;
  catalog_name: string;
  catalog_id: string | null;
  business_account_id: string | null;
  ad_account_id: string | null;
  status: 'connected' | 'disconnected' | 'error';
  feed_url: string | null;
  products_in_feed: number;
  health_score: number;
  last_sync_at: string | null;
  next_sync_at: string | null;
  errors: Array<{ id: string; type: string; message: string; productCount?: number }>;
  created_at: string;
  updated_at: string;
}

export interface FeedRow {
  id: string;
  user_id: string;
  store_id: string;
  name: string;
  feed_type: 'xml' | 'csv' | 'tsv';
  feed_url: string | null;
  status: 'active' | 'inactive' | 'error' | 'generating';
  products_included: number;
  errors_count: number;
  warnings_count: number;
  last_generated_at: string | null;
  last_fetched_at: string | null;
  next_refresh_at: string | null;
  created_at: string;
  updated_at: string;
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: { Row: ProfileRow };
      stores: { Row: StoreRow };
      products: { Row: ProductRow };
      product_images: { Row: ProductImageRow };
      templates: { Row: TemplateRow };
      template_categories: { Row: TemplateCategoryRow };
      template_rules: { Row: TemplateRuleRow };
      generated_images: { Row: GeneratedImageRow };
      sync_logs: { Row: SyncLogRow };
      insights: { Row: InsightRow };
      activities: { Row: ActivityRow };
      meta_catalogs: { Row: MetaCatalogRow };
      feeds: { Row: FeedRow };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// Typed Supabase client
export type SupabaseClient = import('@supabase/supabase-js').SupabaseClient<Database>;
