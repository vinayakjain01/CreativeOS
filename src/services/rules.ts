import { getSupabase } from '../lib/supabase';
import type { Rule, RuleCondition, RuleAction } from '../types';
import { mockRules } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';

// Re-export Rule type
export type { Rule };

interface RuleRow {
  id: string;
  rule_type: string;
  rule_operator: string;
  rule_value: string;
  priority: number;
  template_id: string;
  is_active: boolean;
  created_at: string;
  templates: { name: string } | { name: string }[] | null;
}

// Legacy rule_type -> UI condition field.
const FIELD_MAP: Record<string, string> = {
  tag: 'tags',
  vendor: 'vendor',
  product_type: 'product_type',
  discount: 'discount',
  default: 'all',
};

function templateName(rel: RuleRow['templates']): string {
  if (!rel) return 'template';
  return (Array.isArray(rel) ? rel[0]?.name : rel.name) || 'template';
}

function humanType(ruleType: string): string {
  if (ruleType === 'default') return 'Default';
  return ruleType.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapOperator(op: string): RuleCondition['operator'] {
  const allowed: RuleCondition['operator'][] = [
    'equals', 'contains', 'greater_than', 'less_than', 'starts_with', 'ends_with',
  ];
  return (allowed as string[]).includes(op) ? (op as RuleCondition['operator']) : 'equals';
}

function mapRule(row: RuleRow, appliedCount: number): Rule {
  const tName = templateName(row.templates);
  const isDefault = row.rule_type === 'default';

  const conditions: RuleCondition[] = isDefault
    ? []
    : [
        {
          id: `${row.id}-c`,
          field: FIELD_MAP[row.rule_type] ?? row.rule_type,
          operator: mapOperator(row.rule_operator),
          value: row.rule_value,
        },
      ];

  const actions: RuleAction[] = [
    {
      id: `${row.id}-a`,
      type: 'apply_template',
      config: { templateId: row.template_id, templateName: tName },
    },
  ];

  const name = isDefault
    ? `Default → ${tName}`
    : `${humanType(row.rule_type)} ${row.rule_operator.replace('_', ' ')} "${row.rule_value}" → ${tName}`;

  return {
    id: row.id,
    name,
    active: row.is_active,
    priority: row.priority,
    conditions,
    actions,
    appliedCount,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Fetch the user's template-assignment rules (RLS-scoped) joined with their
 * target template. `appliedCount` is a proxy: completed creatives produced
 * from each rule's template (no per-rule counter exists yet).
 */
export async function fetchRules(): Promise<{ data: Rule[]; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: mockRules, source: 'demo' };
  }

  const { data, error } = await supabase
    .from('template_rules')
    .select('id, rule_type, rule_operator, rule_value, priority, template_id, is_active, created_at, templates(name)')
    .order('priority', { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as RuleRow[];

  const applied = await Promise.all(
    rows.map(async (row) => {
      const { count } = await supabase
        .from('generated_images')
        .select('id', { count: 'exact', head: true })
        .eq('template_id', row.template_id)
        .eq('status', 'completed');
      return count ?? 0;
    }),
  );

  return { data: rows.map((row, i) => mapRule(row, applied[i])), source: 'live' };
}
