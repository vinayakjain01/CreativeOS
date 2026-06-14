import { useCallback, useEffect, useRef, useState } from 'react';

export type DataSource = 'live' | 'demo';

export interface AsyncDataState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  /** Where `data` came from: the real backend (`live`) or bundled demo data. */
  source: DataSource;
  /** Re-run the fetcher (e.g. after a sync). */
  refetch: () => void;
}

/**
 * Generic data hook used across CreativeOS screens.
 *
 * `fetcher` returns either the live result and `source: 'live'`, or signals
 * (by returning `source: 'demo'`) that the backend is unavailable and the
 * caller's demo `fallback` should be shown instead. This keeps every screen's
 * loading / error / empty / demo handling identical.
 */
export function useAsyncData<T>(
  fetcher: () => Promise<{ data: T; source: DataSource }>,
  fallback: T,
  deps: unknown[] = [],
): AsyncDataState<T> {
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<DataSource>('demo');
  const [nonce, setNonce] = useState(0);

  // Guard against setState after unmount / stale responses.
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    setLoading(true);
    setError(null);

    fetcher()
      .then((result) => {
        if (id !== requestId.current) return;
        setData(result.data);
        setSource(result.source);
      })
      .catch((err: unknown) => {
        if (id !== requestId.current) return;
        setData(fallback);
        setSource('demo');
        setError(err instanceof Error ? err.message : 'Failed to load data');
      })
      .finally(() => {
        if (id !== requestId.current) return;
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, source, refetch };
}
