import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, OrderItem } from './types';
import { simulateNetwork } from './client';

const KEY = 'mercado.orders';

export async function createOrder(items: OrderItem[], total: number, address: string): Promise<Order> {
  const order: Order = {
    id: 'o' + Date.now().toString(),
    items,
    total,
    address,
    status: 'placed',
    createdAt: Date.now(),
  };
  const raw = await AsyncStorage.getItem(KEY);
  const orders: Order[] = raw ? JSON.parse(raw) : [];
  orders.unshift(order);
  await AsyncStorage.setItem(KEY, JSON.stringify(orders));
  return simulateNetwork(order, 800);
}

// Callback style kept for compatibility with OrdersScreen (predates the
// promise-based services).
export function fetchOrders(cb: (orders: Order[]) => void): void {
  AsyncStorage.getItem(KEY).then(async (raw) => {
    const orders = raw ? JSON.parse(raw) : [];
    cb(await simulateNetwork(orders, 400));
  });
}
