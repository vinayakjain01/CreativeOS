import { productsRepo, type Product } from '../repositories';
import type { DataSource } from '../hooks/useAsyncData';

// Re-export Product type for backward compatibility
export type { Product };

/**
 * Fetch products - wrapper using repository
 */
export async function fetchProducts(): Promise<{ data: Product[]; source: DataSource }> {
  return productsRepo.fetchAll();
}
