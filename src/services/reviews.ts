import AsyncStorage from '@react-native-async-storage/async-storage';
import { Review } from './types';
import { seedReviews } from './data/reviews';
import { simulateNetwork } from './client';

const KEY = 'mercado.reviews';

async function storedReviews(): Promise<Review[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function listReviews(productId: string): Promise<Review[]> {
  const stored = await storedReviews();
  const all = [...stored, ...seedReviews].filter((r) => r.productId === productId);
  all.sort((a, b) => b.createdAt - a.createdAt);
  return simulateNetwork(all, 250);
}

export async function addReview(
  productId: string,
  author: string,
  rating: number,
  text: string
): Promise<Review> {
  const review: Review = {
    id: 'r' + Date.now().toString(),
    productId,
    author,
    rating,
    text: text.trim(),
    createdAt: Date.now(),
  };
  const stored = await storedReviews();
  stored.unshift(review);
  await AsyncStorage.setItem(KEY, JSON.stringify(stored));
  return simulateNetwork(review, 400);
}

export type RatingSummary = { average: number; count: number };

export function summarize(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  // one decimal, e.g. 4.3
  return { average: Math.round((sum / reviews.length) * 10) / 10, count: reviews.length };
}
