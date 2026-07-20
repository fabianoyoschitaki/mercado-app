import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Product } from '../services/types';
import { getProduct } from '../services/products';
import { SELLER_NAMES } from '../services/data/catalog';
import { formatPrice } from '../utils/format';
import { getFavouriteIds, toggleFavourite } from '../../components/ProductCard';
import { useCart } from '../cart/CartContext';
import { colors, radius } from '../theme';
import AppButton from '../../components/AppButton';

export default function ProductDetailScreen({ route }: any) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    getProduct(productId).then(setProduct);
    getFavouriteIds().then((ids) => setFav(ids.includes(productId)));
  }, [productId]);

  // price math shouldn't re-run on unrelated re-renders (fav toggles, add feedback)
  const subtotal = useMemo(
    () => (product ? formatPrice(product.price * qty) : ''),
    [product]
  );

  if (!product) {
    return (
      <View style={[styles.screen, { alignItems: 'center', paddingTop: 48 }]}>
        <ActivityIndicator color={colors.primary} />
        <Text style={{ color: colors.muted, marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{product.icon}</Text>
        </View>
        <View style={styles.nameRow}>
          <Text testID="detail-name" style={styles.name}>{product.name}</Text>
          <TouchableOpacity
            onPress={async () => setFav(await toggleFavourite(product.id))}
            hitSlop={10}
            testID="detail-fav-star"
            accessibilityLabel={fav ? 'favourited' : 'favourite'}
          >
            <Text style={[styles.star, fav && styles.starOn]}>{fav ? '★' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        <Text testID="detail-price" style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.categoryPill}>{product.category}</Text>
          <Text style={styles.seller}>Sold by {SELLER_NAMES[product.sellerId] ?? 'Mercado partner'}</Text>
        </View>
      </View>

      <View style={styles.qtyRow}>
        <Text style={styles.qtyLabel}>Quantity</Text>
        <TouchableOpacity
          testID="qty-minus"
          onPress={() => setQty(Math.max(1, qty - 1))}
          style={styles.qtyBtn}
        >
          <Text style={styles.qtyBtnLabel}>-</Text>
        </TouchableOpacity>
        <Text testID="qty-value" style={styles.qtyValue}>{qty}</Text>
        <TouchableOpacity testID="qty-plus" onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
          <Text style={styles.qtyBtnLabel}>+</Text>
        </TouchableOpacity>
        <Text style={styles.subtotal}>Subtotal: {subtotal}</Text>
      </View>

      <AppButton
        title="Add to Cart"
        onPress={() => {
          addItem(product, qty);
          setAdded(true);
        }}
      />
      {added && (
        <Text testID="added-msg" style={styles.added}>
          Added to cart
        </Text>
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
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 16,
    marginBottom: 12,
  },
  hero: {
    alignSelf: 'center',
    width: 112,
    height: 112,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroEmoji: {
    fontSize: 64,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  star: {
    fontSize: 30,
    color: colors.muted,
    paddingLeft: 8,
  },
  starOn: {
    color: '#F59E0B',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    color: colors.muted,
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  categoryPill: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: 12,
    color: colors.muted,
    overflow: 'hidden',
    marginRight: 10,
  },
  seller: {
    fontSize: 13,
    color: colors.muted,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    marginBottom: 4,
  },
  qtyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 12,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnLabel: {
    fontSize: 18,
    color: colors.text,
    marginTop: -2,
  },
  qtyValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginHorizontal: 14,
    minWidth: 20,
    textAlign: 'center',
  },
  subtotal: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  added: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
});
