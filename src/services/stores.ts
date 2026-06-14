import { storesRepo, type Store } from '../repositories';
import type { DataSource } from '../hooks/useAsyncData';

// Re-export Store type for backward compatibility
export type { Store };

/**
 * Fetch stores - wrapper using repository
 */
export async function fetchStores(): Promise<{ data: Store[]; source: DataSource }> {
  return storesRepo.fetchAll();
}
