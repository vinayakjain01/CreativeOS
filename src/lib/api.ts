// Base URL of the CatalogStudio backend (Next.js) that hosts the generation
// queue and OAuth flows. Empty string = same origin. The SPA itself has no
// server runtime, so write/queue actions are proxied to this backend.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const isApiConfigured = Boolean(API_BASE_URL);

export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}

/** POST JSON to a backend endpoint, sending cookies for the authenticated session. */
export async function apiPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error || `Request failed (${res.status})`);
  return data as T;
}
