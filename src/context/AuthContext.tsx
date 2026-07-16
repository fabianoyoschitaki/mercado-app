import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../services/types';
import { login as loginService } from '../services/auth';

type AuthContextValue = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => {},
  logout: () => {},
});

const SESSION_KEY = 'mercado.session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY).then((raw) => {
      if (raw) setUser(JSON.parse(raw));
    });
  }, []);

  const login = async (email: string, password: string) => {
    const logged = await loginService(email, password);
    setUser(logged);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(logged));
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
