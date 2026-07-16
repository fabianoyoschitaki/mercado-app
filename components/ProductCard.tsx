import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../src/services/types';
import { colors, radius } from '../src/theme';

const FAVS_KEY = 'mercado.favs';

export async function getFavouriteIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(FAVS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function toggleFavourite(productId: string): Promise<boolean> {
  const favs = await getFavouriteIds();
  const isFav = favs.includes(productId);
  const next = isFav ? favs.filter((id) => id !== productId) : [...favs, productId];
  await AsyncStorage.setItem(FAVS_KEY, JSON.stringify(next));
  return !isFav;
}

// price display used across the buyer screens
function money(value: number): string {
  return 'R$ ' + value.toFixed(2);
}

type Props = {
  product: Product;
  onPress: () => void;
};

export default function ProductCard({ product, onPress }: Props) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    getFavouriteIds().then((ids) => setFav(ids.includes(product.id)));
  }, [product.id]);

  const onToggleFav = async () => {
    const nowFav = await toggleFavourite(product.id);
    setFav(nowFav);
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.tile}>
        <Text style={styles.tileEmoji}>{product.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{money(product.price)}</Text>
      </View>
      <TouchableOpacity
        onPress={onToggleFav}
        hitSlop={10}
        testID="fav-star"
        accessibilityLabel={fav ? 'favourited' : 'favourite'}
      >
        <Text style={[styles.star, fav && styles.starOn]}>{fav ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tileEmoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  star: {
    fontSize: 26,
    color: colors.muted,
    paddingHorizontal: 4,
  },
  starOn: {
    color: '#F59E0B',
  },
});
