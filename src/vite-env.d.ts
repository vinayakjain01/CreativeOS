/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xxxx.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase anon/public key (safe for the browser, RLS-protected) */
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
