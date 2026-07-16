import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useCart } from './CartContext';
import { useAuth } from '../context/AuthContext';
import { catalog } from '../services/data/catalog';

// tela do carrinho - verifica no catalogo se o produto ainda existe/ta ativo
export default function CartScreen({ navigation }) {
  const { items, setQty, removeItem, subtotal } = useCart();
  const { user } = useAuth();
  const [, forceRender] = useState(0);

  // re-renderiza quando volta pra tela (o catalogo pode ter mudado)
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => forceRender((n) => n + 1));
    return unsub;
  }, [navigation]);

  const isAvailable = (productId) => {
    const p = catalog.find((c) => c.id === productId);
    return !!p && p.active;
  };

  const iconFor = (productId) => {
    const p = catalog.find((c) => c.id === productId);
    return p ? p.icon : '🛒';
  };

  // total mostrado exclui produto indisponivel (o subtotal do context nao sabe disso)
  const total = items
    .filter((i) => isAvailable(i.productId))
    .reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const onCheckout = () => {
    if (!user) {
      navigation.navigate('Login', { reason: 'checkout' });
      return;
    }
    navigation.navigate('Checkout');
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: '#F6F7F9' }}>
        <Text style={{ color: '#6B7280', textAlign: 'center', marginTop: 32 }}>
          Your cart is empty
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F6F7F9' }}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.productId}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 12,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
              {iconFor(item.productId)} {item.name}
            </Text>
            {isAvailable(item.productId) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Text style={{ color: '#2E7D32', fontWeight: '700' }}>
                  R$ {item.unitPrice.toFixed(2)} x {item.qty}
                </Text>
                <TouchableOpacity
                  onPress={() => setQty(item.productId, item.qty - 1)}
                  style={qtyBtn}
                >
                  <Text style={qtyBtnLabel}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setQty(item.productId, item.qty + 1)}
                  style={qtyBtn}
                >
                  <Text style={qtyBtnLabel}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={{ color: '#DC2626', marginTop: 6 }}>No longer available</Text>
            )}
            <TouchableOpacity onPress={() => removeItem(item.productId)}>
              <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 13 }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Text
        testID="cart-total"
        style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginVertical: 8 }}
      >
        Total: R$ {total.toFixed(2)}
      </Text>
      <TouchableOpacity
        onPress={onCheckout}
        style={{
          backgroundColor: '#2E7D32',
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

// botoezinhos de quantidade
const qtyBtn = {
  marginLeft: 10,
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
};
const qtyBtnLabel = { fontSize: 18, color: '#111827', marginTop: -2 };
