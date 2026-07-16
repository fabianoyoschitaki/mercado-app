import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Order } from '../services/types';
import { fetchOrders } from '../services/orders';
import { formatDate } from '../utils/format';
import { colors, radius } from '../theme';

const STATUS_LABELS: Record<Order['status'], string> = {
  placed: 'Order placed',
  shipped: 'On the way',
  delivered: 'Delivered',
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchOrders((result) => {
        setOrders(result);
        setLoading(false);
      });
    }, [])
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.empty}>No orders yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.total}>
              {formatDate(item.createdAt)} - R$ {item.total.toFixed(2)}
            </Text>
            <Text style={styles.status}>{STATUS_LABELS[item.status]}</Text>
            <Text style={styles.meta}>
              {item.items.length} item(s) to {item.address}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.bg,
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 32,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 14,
    marginBottom: 10,
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  status: {
    marginTop: 2,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  meta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 13,
  },
});
