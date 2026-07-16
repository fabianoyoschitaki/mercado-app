import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Product } from '../services/types';
import { searchProducts } from '../services/products';
import { CATEGORIES } from '../services/data/catalog';
import { FLAGS } from '../config';
import { colors, radius } from '../theme';
import ProductCard from '../../components/ProductCard';

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const requestSeq = useRef(0);

  useFocusEffect(
    useCallback(() => {
      const seq = ++requestSeq.current;
      setLoading(true);
      searchProducts(query, category).then((result) => {
        // drop out-of-order responses (fast typing races the fake network)
        if (seq === requestSeq.current) {
          setProducts(result);
          setLoading(false);
        }
      });
    }, [query, category])
  );

  return (
    <View style={styles.screen}>
      {FLAGS.promoBanner && (
        <Text testID="promo-banner" style={styles.banner}>
          Free delivery this week!
        </Text>
      )}
      <TextInput
        testID="search-input"
        value={query}
        onChangeText={setQuery}
        placeholder="Search products"
        placeholderTextColor={colors.muted}
        style={styles.search}
      />
      <View style={styles.chips}>
        {CATEGORIES.map((c) => {
          const selected = category === c;
          return (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(selected ? undefined : c)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                {selected ? '[' + c + ']' : c}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {loading && products.length === 0 ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
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
  banner: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
    padding: 10,
    borderRadius: radius,
    marginBottom: 10,
    fontWeight: '600',
    overflow: 'hidden',
  },
  search: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 10,
    fontSize: 15,
    color: colors.text,
  },
  chips: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    color: colors.text,
    fontSize: 13,
  },
  chipLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 32,
  },
});
