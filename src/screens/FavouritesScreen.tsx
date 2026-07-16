import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../services/types';
import { listProducts } from '../services/products';
import { getFavouriteIds } from '../../components/ProductCard';
import { formatPrice } from '../utils/format';
import { colors, radius } from '../theme';

export default function FavouritesScreen({ navigation }: any) {
  const [favourites, setFavourites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      Promise.all([listProducts(), getFavouriteIds()]).then(([products, ids]) => {
        setFavourites(products.filter((p) => ids.includes(p.id)));
        setLoading(false);
      });
    }, [])
  );

  if (loading && favourites.length === 0) {
    return (
      <View style={styles.screen}>
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {favourites.length === 0 ? (
        <Text style={styles.empty}>No favourites yet</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
              style={styles.row}
            >
              <Text style={styles.name}>
                {item.icon}  {item.name} - {formatPrice(item.price)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
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
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 14,
    marginBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
