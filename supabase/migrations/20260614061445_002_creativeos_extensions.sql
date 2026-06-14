-- Add missing columns to existing tables and new tables

-- Add creative_status and feed_status to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS creative_status TEXT DEFAULT 'none';
ALTER TABLE products ADD COLUMN IF NOT EXISTS feed_status TEXT DEFAULT 'not_synced';
ALTER TABLE products ADD COLUMN IF NOT EXISTS collection TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percent INTEGER;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_creative_at TIMESTAMPTZ;

-- Add missing columns to stores
ALTER TABLE stores ADD COLUMN IF NOT EXISTS products_count INTEGER DEFAULT 0;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT 100;

-- Add usage tracking to templates
ALTER TABLE templates ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'custom';
ALTER TABLE templates ADD COLUMN IF NOT EXISTS performance_ctr DECIMAL(4, 2);
ALTER TABLE templates ADD COLUMN IF NOT EXISTS performance_conversions INTEGER DEFAULT 0;

-- ============================================================================
-- INSIGHTS - AI-generated insights for the dashboard
-- ============================================================================
CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('info', 'warning', 'success', 'action')),
  title TEXT NOT NULL,
  description TEXT,
  action_label TEXT,
  action_href TEXT,
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insights_select_own" ON insights FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "insights_insert_own" ON insights FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "insights_update_own" ON insights FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "insights_delete_own" ON insights FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- ============================================================================
-- ACTIVITIES - Live activity feed entries
-- ============================================================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('product_sync', 'creative_generated', 'feed_refresh', 'meta_sync', 'rule_applied', 'template_applied')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activities_select_own" ON activities FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "activities_insert_own" ON activities FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- ============================================================================
-- META_CATALOGS - Meta Business catalog connections
-- ============================================================================
CREATE TABLE meta_catalogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE UNIQUE,
  catalog_name TEXT NOT NULL,
  catalog_id TEXT,
  business_account_id TEXT,
  ad_account_id TEXT,
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  feed_url TEXT,
  products_in_feed INTEGER DEFAULT 0,
  health_score INTEGER DEFAULT 0,
  last_sync_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  errors JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meta_catalogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "meta_catalogs_select_own" ON meta_catalogs FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "meta_catalogs_insert_own" ON meta_catalogs FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "meta_catalogs_update_own" ON meta_catalogs FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "meta_catalogs_delete_own" ON meta_catalogs FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- ============================================================================
-- FEEDS - Product feeds
-- ============================================================================
CREATE TABLE feeds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  feed_type TEXT DEFAULT 'xml' CHECK (feed_type IN ('xml', 'csv', 'tsv')),
  feed_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'generating')),
  products_included INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  last_generated_at TIMESTAMPTZ,
  last_fetched_at TIMESTAMPTZ,
  next_refresh_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feeds_select_own" ON feeds FOR SELECT
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "feeds_insert_own" ON feeds FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "feeds_update_own" ON feeds FOR UPDATE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

CREATE POLICY "feeds_delete_own" ON feeds FOR DELETE
  USING (user_id IN (SELECT id FROM profiles WHERE id = (SELECT auth.uid())));

-- Indexes for performance
CREATE INDEX idx_products_creative_status ON products(creative_status);
CREATE INDEX idx_products_feed_status ON products(feed_status);
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_created_at ON insights(created_at DESC);
CREATE INDEX idx_generated_images_status ON generated_images(status);