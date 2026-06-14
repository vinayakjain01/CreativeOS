// Re-export all types from repositories for backward compatibility
export type {
  Store,
  Product,
  Template,
  TemplateRule,
  Rule,
  RuleCondition,
  RuleAction,
  GenerationJob,
  Insight,
  Activity,
  MetaCatalogConnection,
  MetaCatalogError,
  Feed,
} from '../repositories';

// Additional types used in the UI but not in repositories
export interface TemplateCategoryInfo {
  id: string;
  label: string;
  count: number;
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

export interface MetaError {
  id: string;
  type: 'validation' | 'system' | 'warning';
  message: string;
  productCount?: number;
  timestamp: Date;
}
