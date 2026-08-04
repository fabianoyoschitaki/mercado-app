export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // BRL, e.g. 12.5
  category: 'produce' | 'bakery' | 'dairy' | 'pantry';
  icon: string; // emoji used as the product image in the mock catalog
  sellerId: string;
  active: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  unitPrice: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  address: string;
  status: 'placed' | 'shipped' | 'delivered';
  createdAt: number;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1..5
  text: string;
  createdAt: number;
};

export type User = {
  email: string;
  name: string;
  isSeller: boolean;
  sellerId?: string;
};
