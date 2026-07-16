import { Product } from './types';
import { catalog } from './data/catalog';
import { API_URL, simulateNetwork } from './client';

export async function listProducts(): Promise<Product[]> {
  if (API_URL) {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  }
  return simulateNetwork(catalog.filter((p) => p.active));
}

export async function searchProducts(query: string, category?: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  return simulateNetwork(
    catalog.filter(
      (p) =>
        p.active &&
        (q === '' || p.name.toLowerCase().includes(q)) &&
        (!category || p.category === category)
    ),
    250
  );
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return simulateNetwork(catalog.find((p) => p.id === id), 300);
}
