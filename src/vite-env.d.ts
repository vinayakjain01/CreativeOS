/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xxxx.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon/public key (safe for the browser, RLS-protected) */
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Base URL of the CatalogStudio backend (queue, OAuth). Empty = same origin. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
