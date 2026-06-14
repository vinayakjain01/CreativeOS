import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// ──────────────────────────────────────────────────────────────────────────
// Supabase browser client
//
// CreativeOS reads the SAME Postgres schema that CatalogStudio writes to
// (stores / products / product_images / templates / generated_images / …).
// That schema is the source of truth for business data — we never fork it.
//
// The anon key is safe to ship to the browser: every table is protected by
// Row-Level Security, so a request only ever returns the signed-in user's
// rows. Until a user is authenticated, RLS returns nothing — which is why the
// data layer falls back to demo data when Supabase is unconfigured (see
// `isSupabaseConfigured`).
// ──────────────────────────────────────────────────────────────────────────

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * True only when both env vars are present. Screens use this to decide whether
 * to hit the real backend or render labelled demo data, so the app stays
 * usable (and obviously-demo) before a backend is wired up.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient<Database> | null = null;

/**
 * Returns the shared Supabase client, or `null` when the project isn't
 * configured. Callers must handle `null` and fall back to demo data.
 */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
