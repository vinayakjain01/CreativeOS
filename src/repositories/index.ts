import { getSupabase } from '../lib/supabase';
import type {
  StoreRow,
  ProductRow,
  TemplateRow,
  TemplateRuleRow,
  GeneratedImageRow,
  InsightRow,
  ActivityRow,
  MetaCatalogRow,
  FeedRow
} from '../lib/database.types';
import type { DataSource } from '../hooks/useAsyncData';

// ──────────────────────────────────────────────────────────────────────────
// STORES REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Store {
  id: string;
  name: string;
  domain: string;
  platform: 'shopify' | 'woocommerce' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  productsCount: number;
  lastSync: Date;
  healthScore: number;
}

function mapStore(row: StoreRow, productsCount: number): Store {
  let health = 100;
  if (!row.is_active) health = 40;
  else if (!row.last_synced_at) health = 60;
  else {
    const ageHours = (Date.now() - new Date(row.last_synced_at).getTime()) / 3_600_000;
    if (ageHours <= 24) health = 98;
    else if (ageHours <= 24 * 7) health = 85;
    else health = 70;
  }

  return {
    id: row.id,
    name: row.shop_name || row.shop_domain,
    domain: row.shop_domain,
    platform: 'shopify',
    status: row.is_active ? 'connected' : 'disconnected',
    productsCount,
    lastSync: new Date(row.last_synced_at || row.installed_at || Date.now()),
    healthScore: health,
  };
}

export const storesRepo = {
  async fetchAll(): Promise<{ data: Store[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('stores')
      .select('id, user_id, shop_domain, shop_name, shop_email, currency, is_active, installed_at, last_synced_at')
      .order('installed_at', { ascending: false });

    if (error) throw new Error(error.message);

    const rows = (data as StoreRow[]) ?? [];
    const counts = await Promise.all(
      rows.map(async (row) => {
        const { count } = await supabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .eq('store_id', row.id);
        return count ?? 0;
      })
    );

    return { data: rows.map((row, i) => mapStore(row, counts[i])), source: 'live' };
  },

  async fetchPrimary(): Promise<{ data: Store | null; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, source: 'demo' };

    const { data, error } = await supabase
      .from('stores')
      .select('id, user_id, shop_domain, shop_name, shop_email, currency, is_active, installed_at, last_synced_at')
      .eq('is_active', true)
      .order('installed_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return { data: null, source: 'live' };

    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', data.id);

    return { data: mapStore(data as StoreRow, count ?? 0), source: 'live' };
  },

  async disconnect(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('stores')
      .update({ is_active: false })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};

// ──────────────────────────────────────────────────────────────────────────
// PRODUCTS REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  sku: string;
  name: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  status: 'active' | 'draft' | 'archived';
  creativeStatus: 'generated' | 'pending' | 'failed' | 'none';
  feedStatus: 'synced' | 'pending' | 'error' | 'not_synced';
  tags: string[];
  collection: string;
  lastUpdated: Date;
}

interface ProductWithImages extends ProductRow {
  product_images: { src: string; is_primary: boolean; position: number | null }[];
  generated_images: { status: string; updated_at: string }[];
}

function mapProduct(row: ProductWithImages): Product {
  // Compute discount
  let discount: number | undefined;
  if (row.compare_at_price && row.compare_at_price > (row.price ?? 0)) {
    discount = Math.round(((row.compare_at_price - (row.price ?? 0)) / row.compare_at_price) * 100);
  }

  // Pick primary image
  let image = '';
  if (row.product_images?.length) {
    const primary = row.product_images.find(i => i.is_primary);
    image = primary?.src ?? row.product_images[0]?.src ?? '';
  }

  // Derive creative status
  let creativeStatus: Product['creativeStatus'] = 'none';
  if (row.generated_images?.length) {
    if (row.generated_images.some(g => g.status === 'completed')) creativeStatus = 'generated';
    else if (row.generated_images.some(g => g.status === 'failed')) creativeStatus = 'failed';
    else if (row.generated_images.some(g => g.status === 'pending' || g.status === 'processing')) creativeStatus = 'pending';
  }

  // Derive feed status
  let feedStatus: Product['feedStatus'] = 'not_synced';
  if (creativeStatus === 'generated') feedStatus = 'synced';
  else if (creativeStatus === 'pending') feedStatus = 'pending';
  else if (creativeStatus === 'failed') feedStatus = 'error';

  return {
    id: row.id,
    sku: row.sku || row.shopify_id,
    name: row.title,
    image,
    price: row.price ?? 0,
    compareAtPrice: row.compare_at_price ?? undefined,
    discount,
    status: row.status === 'draft' ? 'draft' : row.status === 'archived' ? 'archived' : 'active',
    creativeStatus,
    feedStatus,
    tags: row.tags ?? [],
    collection: row.collection || row.product_type || 'Uncategorized',
    lastUpdated: new Date(row.updated_at),
  };
}

const PRODUCT_SELECT = `
  id, shopify_id, sku, title, handle, vendor, product_type, collection, tags,
  price, compare_at_price, discount_percent, status, creative_status, feed_status,
  updated_at,
  product_images ( src, is_primary, position ),
  generated_images ( status, updated_at )
`;

export const productsRepo = {
  async fetchAll(limit = 500): Promise<{ data: Product[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return { data: (data as ProductWithImages[]).map(mapProduct), source: 'live' };
  },

  async fetchByStore(storeId: string, limit = 500): Promise<{ data: Product[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('store_id', storeId)
      .order('updated_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return { data: (data as ProductWithImages[]).map(mapProduct), source: 'live' };
  },

  async fetchOne(id: string): Promise<{ data: Product | null; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, source: 'demo' };

    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      .single();

    if (error) return { data: null, source: 'live' };

    return { data: mapProduct(data as ProductWithImages), source: 'live' };
  },

  async count(): Promise<{ data: number; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: 0, source: 'demo' };

    const { count, error } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    if (error) throw new Error(error.message);
    return { data: count ?? 0, source: 'live' };
  },
};

// ──────────────────────────────────────────────────────────────────────────
// TEMPLATES REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: 'sale' | 'new-arrival' | 'bestseller' | 'seasonal' | 'discount' | 'custom';
  usageCount: number;
  performance: { ctr: number; conversions: number };
  rules: TemplateRule[];
  createdAt: Date;
}

export interface TemplateRule {
  type: 'text' | 'image' | 'badge' | 'overlay';
  config: Record<string, unknown>;
}

function mapTemplate(row: TemplateRow): Template {
  return {
    id: row.id,
    name: row.name,
    thumbnail: row.thumbnail_url || '',
    category: (row.category as Template['category']) || 'custom',
    usageCount: row.usage_count || 0,
    performance: {
      ctr: row.performance_ctr || 0,
      conversions: row.performance_conversions || 0,
    },
    rules: (row.canvas_data as TemplateRule[]) || [],
    createdAt: new Date(row.created_at),
  };
}

export const templatesRepo = {
  async fetchAll(): Promise<{ data: Template[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { data: (data as TemplateRow[]).map(mapTemplate), source: 'live' };
  },

  async fetchOne(id: string): Promise<{ data: Template | null; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, source: 'demo' };

    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, source: 'live' };

    return { data: mapTemplate(data as TemplateRow), source: 'live' };
  },

  async create(template: Omit<Template, 'id' | 'createdAt'>): Promise<{ data: Template; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('templates')
      .insert({
        name: template.name,
        thumbnail_url: template.thumbnail,
        category: template.category,
        usage_count: template.usageCount,
        canvas_data: template.rules,
        performance_ctr: template.performance.ctr,
        performance_conversions: template.performance.conversions,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data: mapTemplate(data as TemplateRow), source: 'live' };
  },

  async update(id: string, updates: Partial<Template>): Promise<{ data: Template; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    const updateData: Record<string, unknown> = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.thumbnail) updateData.thumbnail_url = updates.thumbnail;
    if (updates.category) updateData.category = updates.category;
    if (updates.usageCount !== undefined) updateData.usage_count = updates.usageCount;
    if (updates.performance) {
      updateData.performance_ctr = updates.performance.ctr;
      updateData.performance_conversions = updates.performance.conversions;
    }

    const { data, error } = await supabase
      .from('templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data: mapTemplate(data as TemplateRow), source: 'live' };
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ──────────────────────────────────────────────────────────────────────────
// RULES REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Rule {
  id: string;
  name: string;
  active: boolean;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  appliedCount: number;
  createdAt: Date;
}

export interface RuleCondition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'starts_with' | 'ends_with';
  value: string | number;
  conjunction?: 'and' | 'or';
}

export interface RuleAction {
  id: string;
  type: 'apply_template' | 'add_badge' | 'set_price' | 'update_feed';
  config: Record<string, unknown>;
}

function mapRule(row: TemplateRuleRow): Rule {
  return {
    id: row.id,
    name: `Rule for ${row.rule_type}`,
    active: row.is_active ?? true,
    priority: row.priority ?? 0,
    conditions: [
      {
        id: `${row.id}-cond`,
        field: row.rule_type,
        operator: row.rule_operator as RuleCondition['operator'],
        value: row.rule_value,
      },
    ],
    actions: [
      {
        id: `${row.id}-action`,
        type: 'apply_template',
        config: { templateId: row.template_id },
      },
    ],
    appliedCount: 0,
    createdAt: new Date(row.created_at),
  };
}

export const rulesRepo = {
  async fetchAll(): Promise<{ data: Rule[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('template_rules')
      .select('*')
      .order('priority', { ascending: true });

    if (error) throw new Error(error.message);

    return { data: (data as TemplateRuleRow[]).map(mapRule), source: 'live' };
  },

  async create(rule: Omit<Rule, 'id' | 'createdAt' | 'appliedCount'>): Promise<{ data: Rule; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase not configured');

    // Get first template for simplicity
    const templates = await templatesRepo.fetchAll();
    const templateId = templates.data[0]?.id;

    const { data, error } = await supabase
      .from('template_rules')
      .insert({
        name: rule.name,
        conditions: rule.conditions,
        actions: rule.actions,
        is_active: rule.active,
        priority: rule.priority,
        template_id: templateId,
        rule_type: rule.conditions[0]?.field || 'tags',
        rule_operator: rule.conditions[0]?.operator || 'contains',
        rule_value: String(rule.conditions[0]?.value || ''),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { data: mapRule(data as TemplateRuleRow), source: 'live' };
  },

  async toggle(id: string, active: boolean): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('template_rules')
      .update({ is_active: active })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async delete(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.from('template_rules').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};

// ──────────────────────────────────────────────────────────────────────────
// JOBS REPOSITORY (Generation Jobs)
// ──────────────────────────────────────────────────────────────────────────

export interface GenerationJob {
  id: string;
  productId: string;
  productName: string;
  template: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

function mapJob(row: GeneratedImageRow): GenerationJob {
  return {
    id: row.id,
    productId: row.product_id,
    productName: 'Product',
    template: 'Template',
    status: row.status === 'pending' ? 'queued' : row.status as GenerationJob['status'],
    progress: row.status === 'completed' ? 100 : row.status === 'processing' ? 50 : 0,
    startedAt: row.created_at ? new Date(row.created_at) : undefined,
    completedAt: row.updated_at && row.status === 'completed' ? new Date(row.updated_at) : undefined,
    error: row.error_message || undefined,
  };
}

export const jobsRepo = {
  async fetchAll(limit = 100): Promise<{ data: GenerationJob[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return { data: (data as GeneratedImageRow[]).map(mapJob), source: 'live' };
  },

  async fetchByStatus(status: GenerationJob['status']): Promise<{ data: GenerationJob[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const statusMap: Record<string, string> = {
      queued: 'pending',
      processing: 'processing',
      completed: 'completed',
      failed: 'failed',
    };

    const { data, error } = await supabase
      .from('generated_images')
      .select('*')
      .eq('status', statusMap[status] || status)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { data: (data as GeneratedImageRow[]).map(mapJob), source: 'live' };
  },

  async counts(): Promise<{ total: number; queued: number; processing: number; completed: number; failed: number }> {
    const supabase = getSupabase();
    if (!supabase) return { total: 0, queued: 0, processing: 0, completed: 0, failed: 0 };

    const [total, queued, processing, completed, failed] = await Promise.all([
      supabase.from('generated_images').select('id', { count: 'exact', head: true }),
      supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'processing'),
      supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('generated_images').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);

    return {
      total: total.count ?? 0,
      queued: queued.count ?? 0,
      processing: processing.count ?? 0,
      completed: completed.count ?? 0,
      failed: failed.count ?? 0,
    };
  },
};

// ──────────────────────────────────────────────────────────────────────────
// INSIGHTS REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'action';
  title: string;
  description: string;
  action?: { label: string; href: string };
  timestamp: Date;
}

function mapInsight(row: InsightRow): Insight {
  return {
    id: row.id,
    type: row.insight_type,
    title: row.title,
    description: row.description || '',
    action: row.action_label && row.action_href ? { label: row.action_label, href: row.action_href } : undefined,
    timestamp: new Date(row.created_at),
  };
}

export const insightsRepo = {
  async fetchAll(limit = 10): Promise<{ data: Insight[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return { data: (data as InsightRow[]).map(mapInsight), source: 'live' };
  },

  async dismiss(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('insights')
      .update({ is_dismissed: true })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async markRead(id: string): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('insights')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },
};

// ──────────────────────────────────────────────────────────────────────────
// ACTIVITIES REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  type: 'product_sync' | 'creative_generated' | 'feed_refresh' | 'meta_sync' | 'rule_applied';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

function mapActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    type: row.activity_type,
    title: row.title,
    description: row.description || '',
    timestamp: new Date(row.created_at),
    metadata: row.metadata,
  };
}

export const activitiesRepo = {
  async fetchAll(limit = 10): Promise<{ data: Activity[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);

    return { data: (data as ActivityRow[]).map(mapActivity), source: 'live' };
  },

  async create(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<void> {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase.from('activities').insert({
      activity_type: activity.type,
      title: activity.title,
      description: activity.description,
      metadata: activity.metadata || {},
    });

    if (error) throw new Error(error.message);
  },
};

// ──────────────────────────────────────────────────────────────────────────
// META CATALOGS REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface MetaCatalogConnection {
  id: string;
  name: string;
  businessAccountId: string;
  adAccountId: string;
  status: 'connected' | 'disconnected' | 'error';
  feedUrl: string;
  productsInFeed: number;
  lastRefresh: Date;
  nextRefresh: Date;
  healthScore: number;
  errors: MetaCatalogError[];
}

export interface MetaCatalogError {
  id: string;
  type: 'validation' | 'system' | 'warning';
  message: string;
  productCount?: number;
  timestamp: Date;
}

function mapMetaCatalog(row: MetaCatalogRow): MetaCatalogConnection {
  return {
    id: row.id,
    name: row.catalog_name,
    businessAccountId: row.business_account_id || '',
    adAccountId: row.ad_account_id || '',
    status: row.status,
    feedUrl: row.feed_url || '',
    productsInFeed: row.products_in_feed,
    lastRefresh: new Date(row.last_sync_at || Date.now()),
    nextRefresh: new Date(row.next_sync_at || Date.now()),
    healthScore: row.health_score,
    errors: (row.errors as MetaCatalogError[]) || [],
  };
}

export const metaCatalogsRepo = {
  async fetchAll(): Promise<{ data: MetaCatalogConnection[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('meta_catalogs')
      .select('*');

    if (error) throw new Error(error.message);

    return { data: (data as MetaCatalogRow[]).map(mapMetaCatalog), source: 'live' };
  },

  async fetchOne(id: string): Promise<{ data: MetaCatalogConnection | null; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, source: 'demo' };

    const { data, error } = await supabase
      .from('meta_catalogs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, source: 'live' };

    return { data: mapMetaCatalog(data as MetaCatalogRow), source: 'live' };
  },
};

// ──────────────────────────────────────────────────────────────────────────
// FEEDS REPOSITORY
// ──────────────────────────────────────────────────────────────────────────

export interface Feed {
  id: string;
  name: string;
  type: 'xml' | 'csv' | 'tsv';
  url: string;
  status: 'active' | 'inactive' | 'error' | 'generating';
  productsIncluded: number;
  lastGenerated: Date;
  lastMetaFetch: Date;
  errors: number;
  warnings: number;
}

function mapFeed(row: FeedRow): Feed {
  return {
    id: row.id,
    name: row.name,
    type: row.feed_type,
    url: row.feed_url || '',
    status: row.status,
    productsIncluded: row.products_included,
    lastGenerated: new Date(row.last_generated_at || Date.now()),
    lastMetaFetch: new Date(row.last_fetched_at || Date.now()),
    errors: row.errors_count,
    warnings: row.warnings_count,
  };
}

export const feedsRepo = {
  async fetchAll(): Promise<{ data: Feed[]; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: [], source: 'demo' };

    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return { data: (data as FeedRow[]).map(mapFeed), source: 'live' };
  },

  async fetchOne(id: string): Promise<{ data: Feed | null; source: DataSource }> {
    const supabase = getSupabase();
    if (!supabase) return { data: null, source: 'demo' };

    const { data, error } = await supabase
      .from('feeds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return { data: null, source: 'live' };

    return { data: mapFeed(data as FeedRow), source: 'live' };
  },
};
