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

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: TemplateCategory;
  usageCount: number;
  performance: {
    ctr: number;
    conversions: number;
  };
  rules: TemplateRule[];
  createdAt: Date;
}

export type TemplateCategory = 'sale' | 'new-arrival' | 'bestseller' | 'seasonal' | 'custom' | 'discount';

export interface TemplateRule {
  type: 'text' | 'image' | 'badge' | 'overlay';
  config: Record<string, unknown>;
}

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

export interface MetaCatalog {
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
  errors: MetaError[];
}

export interface MetaError {
  id: string;
  type: 'validation' | 'system' | 'warning';
  message: string;
  productCount?: number;
  timestamp: Date;
}

export interface Feed {
  id: string;
  name: string;
  type: 'xml' | 'csv' | 'tsv';
  url: string;
  status: 'active' | 'inactive' | 'error';
  productsIncluded: number;
  lastGenerated: Date;
  lastMetaFetch: Date;
  errors: number;
  warnings: number;
}

export interface Insight {
  id: string;
  type: 'info' | 'warning' | 'success' | 'action';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  timestamp: Date;
}

export interface Activity {
  id: string;
  type: 'product_sync' | 'creative_generated' | 'feed_refresh' | 'meta_sync' | 'rule_applied';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AnalyticsData {
  productsSynced: number;
  creativesGenerated: number;
  metaUpdates: number;
  automationSuccessRate: number;
  averageGenerationTime: number;
  feedRefreshes: number;
  catalogCoverage: number;
  templateUsage: Record<string, number>;
  generationTrend: { date: string; count: number }[];
  syncTrend: { date: string; count: number }[];
}
