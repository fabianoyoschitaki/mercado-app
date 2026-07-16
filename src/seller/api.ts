import { catalog } from '../services/data/catalog';

// Seller-side API. Uses cents for money to avoid float issues on totals.
export interface Listing {
  listingId: string;
  title: string;
  priceCents: number;
  live: boolean;
}

export function getMyListings(sellerId: string): Listing[] {
  return catalog
    .filter((p) => p.sellerId === sellerId)
    .map((p) => ({
      listingId: p.id,
      title: p.name,
      priceCents: Math.round(p.price * 100),
      live: p.active,
    }));
}

export function setListingLive(listingId: string, live: boolean): void {
  const product = catalog.find((p) => p.id === listingId);
  if (product) {
    product.active = live;
  }
}

export function centsToDisplay(cents: number): string {
  return 'R$ ' + (cents / 100).toFixed(2);
}
