// Re-export stores from repositories
export { storesRepo as fetchStoresUtil } from '../repositories';
import { storesRepo } from '../repositories';
import type { DataSource } from '../hooks/useAsyncData';
import type { Store } from '../repositories';

/**
 * Fetch stores - wrapper for backward compatibility
 */
export async function fetchStores(): Promise<{ data: Store[]; source: DataSource }> {
  return storesRepo.fetchAll();
}
