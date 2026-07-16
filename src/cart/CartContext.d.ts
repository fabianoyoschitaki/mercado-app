// Hand-written declarations for CartContext.js until it gets migrated to TS.
import { Product } from '../services/types';

export type CartItem = {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
};

export function CartProvider(props: { children: React.ReactNode }): JSX.Element;

export function useCart(): {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};
