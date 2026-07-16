import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useCart } from './CartContext';
import { catalog } from '../services/data/catalog';
import { createOrder } from '../services/orders';

// checkout - monta o pedido a partir do carrinho
// obs: refaz a conta do total aqui em vez de confiar no subtotal do context,
// porque produto delistado nao pode ser cobrado
export default function CheckoutScreen({ navigation }) {
  const { items, clear } = useCart();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  const available = items.filter((i) => {
    const p = catalog.find((c) => c.id === i.productId);
    return !!p && p.active;
  });

  const total = available.reduce((sum, i) => sum + i.unitPrice * i.qty, 0);

  const onPlaceOrder = async () => {
    if (placing) return; // evita pedido duplicado no toque duplo
    if (address.trim() === '') {
      setError('Delivery address is required');
      return;
    }
    setPlacing(true);
    const orderItems = available.map((i) => ({
      productId: i.productId,
      name: i.name,
      unitPrice: i.unitPrice,
      qty: i.qty,
    }));
    await createOrder(orderItems, total, address.trim());
    clear();
    setPlacing(false);
    navigation.popToTop(); // volta a stack do carrinho pro inicio
    navigation.navigate('Orders');
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F6F7F9' }}>
      <View
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          padding: 14,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#6B7280', fontSize: 13 }}>Items: {available.length}</Text>
        <Text
          testID="checkout-total"
          style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginTop: 4 }}
        >
          Order total: R$ {total.toFixed(2)}
        </Text>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>
        Delivery address
      </Text>
      <TextInput
        testID="address-input"
        value={address}
        onChangeText={setAddress}
        placeholder="Street, number"
        placeholderTextColor="#6B7280"
        style={{
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          fontSize: 15,
          color: '#111827',
        }}
      />
      {error !== '' && (
        <Text testID="checkout-error" style={{ color: '#DC2626', marginBottom: 8 }}>
          {error}
        </Text>
      )}
      <TouchableOpacity
        onPress={onPlaceOrder}
        style={{
          backgroundColor: '#2E7D32',
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>Place Order</Text>
      </TouchableOpacity>
      {placing && <ActivityIndicator color="#2E7D32" style={{ marginTop: 12 }} />}
    </View>
  );
}
