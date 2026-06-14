import { getSupabase } from '../lib/supabase';
import type { Template, TemplateCategory } from '../types';
import { mockTemplates } from '../data/mockData';
import type { DataSource } from '../hooks/useAsyncData';

// Neutral inline placeholder for templates without a rendered thumbnail yet.
const PLACEHOLDER_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="#e5e7eb"/><text x="50%" y="50%" font-family="sans-serif" font-size="20" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">No preview</text></svg>`,
  );

interface TemplateRow {
  id: string;
  name: string;
  thumbnail_url: string | null;
  created_at: string;
  template_categories: { name: string } | { name: string }[] | null;
}

/** Map a free-text category name to the UI's fixed category palette. */
function mapCategory(name: string | null): TemplateCategory {
  const n = (name ?? '').toLowerCase();
  if (n.includes('sale')) return 'sale';
  if (n.includes('new')) return 'new-arrival';
  if (n.includes('best')) return 'bestseller';
  if (n.includes('season')) return 'seasonal';
  if (n.includes('discount')) return 'discount';
  return 'custom';
}

function categoryName(rel: TemplateRow['template_categories']): string | null {
  if (!rel) return null;
  return Array.isArray(rel) ? rel[0]?.name ?? null : rel.name;
}

/**
 * Fetch the user's templates. `usageCount` is the real number of creatives
 * generated from each template; performance (CTR/conversions) has no source
 * yet, so it reads 0 in live mode. Falls back to demo data when unconfigured.
 */
export async function fetchTemplates(): Promise<{ data: Template[]; source: DataSource }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { data: mockTemplates, source: 'demo' };
  }

  const { data, error } = await supabase
    .from('templates')
    .select('id, name, thumbnail_url, created_at, template_categories(name)')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as unknown as TemplateRow[];

  // Real usage = creatives generated from each template (parallel head counts).
  const usage = await Promise.all(
    rows.map(async (row) => {
      const { count } = await supabase
        .from('generated_images')
        .select('id', { count: 'exact', head: true })
        .eq('template_id', row.id);
      return count ?? 0;
    }),
  );

  const templates: Template[] = rows.map((row, i) => ({
    id: row.id,
    name: row.name,
    thumbnail: row.thumbnail_url || PLACEHOLDER_THUMB,
    category: mapCategory(categoryName(row.template_categories)),
    usageCount: usage[i],
    performance: { ctr: 0, conversions: 0 },
    rules: [],
    createdAt: new Date(row.created_at),
  }));

  return { data: templates, source: 'live' };
}
