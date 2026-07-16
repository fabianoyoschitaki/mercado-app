import { Product } from '../types';

// In-memory catalog. Seller actions mutate `active` at runtime.
export const catalog: Product[] = [
  { id: 'p01', icon: '🍌', name: 'Bananas', description: 'Fresh bananas, per kg', price: 5.9, category: 'produce', sellerId: 's1', active: true },
  { id: 'p02', icon: '🍅', name: 'Tomatoes', description: 'Ripe tomatoes, per kg', price: 8.5, category: 'produce', sellerId: 's1', active: true },
  { id: 'p03', icon: '🥬', name: 'Lettuce', description: 'Crisp lettuce head', price: 3.5, category: 'produce', sellerId: 's2', active: true },
  { id: 'p04', icon: '🍞', name: 'Sourdough Bread', description: 'Baked this morning', price: 14.0, category: 'bakery', sellerId: 's2', active: true },
  { id: 'p05', icon: '🥐', name: 'Croissant', description: 'Butter croissant', price: 6.5, category: 'bakery', sellerId: 's2', active: true },
  { id: 'p06', icon: '🥛', name: 'Whole Milk', description: '1L whole milk', price: 4.8, category: 'dairy', sellerId: 's1', active: true },
  { id: 'p07', icon: '🧀', name: 'Minas Cheese', description: 'Traditional minas cheese, 500g', price: 22.0, category: 'dairy', sellerId: 's1', active: true },
  { id: 'p08', icon: '🥣', name: 'Yogurt', description: 'Natural yogurt, 170g', price: 3.2, category: 'dairy', sellerId: 's2', active: true },
  { id: 'p09', icon: '🍚', name: 'Rice 5kg', description: 'White rice, 5kg bag', price: 27.9, category: 'pantry', sellerId: 's1', active: true },
  { id: 'p10', icon: '🫘', name: 'Black Beans', description: 'Black beans, 1kg', price: 9.4, category: 'pantry', sellerId: 's1', active: true },
  { id: 'p11', icon: '🫒', name: 'Olive Oil', description: 'Extra virgin, 500ml', price: 32.0, category: 'pantry', sellerId: 's2', active: true },
  { id: 'p12', icon: '☕', name: 'Coffee 500g', description: 'Ground coffee, medium roast', price: 18.9, category: 'pantry', sellerId: 's1', active: false },
];

export const CATEGORIES = ['produce', 'bakery', 'dairy', 'pantry'] as const;

export const SELLER_NAMES: Record<string, string> = {
  s1: 'Sunny Farms',
  s2: 'Village Market',
};
