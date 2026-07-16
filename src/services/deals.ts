import { Product } from './types';
import { catalog } from './data/catalog';

export async function getFlashDeals(): Promise<Product[]> {
  return catalog.filter((p) => p.active && p.price < 10);
}
