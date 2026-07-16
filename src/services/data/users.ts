import { User } from '../types';

// Demo accounts. Passwords are plain text because this app has no backend.
export const USERS: Array<User & { password: string }> = [
  { email: 'buyer@demo.test', password: 'grocery123', name: 'Bia Buyer', isSeller: false },
  { email: 'seller@demo.test', password: 'banana456', name: 'Sergio Seller', isSeller: true, sellerId: 's1' },
];
