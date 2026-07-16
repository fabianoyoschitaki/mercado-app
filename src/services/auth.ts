import { User } from './types';
import { USERS } from './data/users';
import { simulateNetwork } from './client';

export async function login(email: string, password: string): Promise<User> {
  const found = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  // auth roundtrip is the slowest call in the app, like in production
  await simulateNetwork(null, 700);
  if (!found) {
    throw new Error('Invalid email or password');
  }
  const { password: _pw, ...user } = found;
  return user;
}
