import { Review } from '../types';

// Seed reviews for the mock catalog, same idea as `catalog.ts`. User-submitted
// reviews are stored on-device and merged in by the reviews service.
export const seedReviews: Review[] = [
  {
    id: 'r01',
    productId: 'p01',
    author: 'Carla M.',
    rating: 5,
    text: 'Always fresh, my kids love them.',
    createdAt: 1752505200000,
  },
  {
    id: 'r02',
    productId: 'p01',
    author: 'Roberto S.',
    rating: 4,
    text: 'Good bananas, a couple were bruised.',
    createdAt: 1752850800000,
  },
  {
    id: 'r03',
    productId: 'p02',
    author: 'Ana P.',
    rating: 5,
    text: 'Best sourdough in the neighborhood.',
    createdAt: 1753023600000,
  },
  {
    id: 'r04',
    productId: 'p03',
    author: 'Marcos L.',
    rating: 3,
    text: 'Arrived close to the expiry date.',
    createdAt: 1753110000000,
  },
  {
    id: 'r05',
    productId: 'p05',
    author: 'Juliana F.',
    rating: 5,
    text: 'Great price for the quality.',
    createdAt: 1753196400000,
  },
];
