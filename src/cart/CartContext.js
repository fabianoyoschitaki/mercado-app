import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// carrinho global - guarda direto no AsyncStorage pra nao perder nada
// TODO migrar pra typescript junto com o resto (um dia)
const CartContext = createContext(null);

const KEY = 'mercado.cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // { productId, name, unitPrice, qty }

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) setItems(JSON.parse(raw));
    });
  }, []);

  const persist = (next) => {
    setItems(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const addItem = (product, qty = 1) => {
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      persist(
        items.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i
        )
      );
    } else {
      persist([
        ...items,
        { productId: product.id, name: product.name, unitPrice: product.price, qty },
      ]);
    }
  };

  const setQty = (productId, qty) => {
    if (qty <= 0) {
      persist(items.filter((i) => i.productId !== productId));
    } else {
      persist(items.map((i) => (i.productId === productId ? { ...i, qty } : i)));
    }
  };

  const removeItem = (productId) => {
    persist(items.filter((i) => i.productId !== productId));
  };

  const clear = () => persist([]);

  // subtotal simples, nao sabe nada de produto delistado - as telas resolvem
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, setQty, removeItem, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
