import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Product, Review } from '../services/types';
import { getProduct } from '../services/products';
import { SELLER_NAMES } from '../services/data/catalog';
import { formatPrice } from '../utils/format';
import { getFavouriteIds, toggleFavourite } from '../../components/ProductCard';
import { listReviews, addReview, summarize } from '../services/reviews';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../cart/CartContext';
import { colors, radius } from '../theme';
import AppButton from '../../components/AppButton';

export default function ProductDetailScreen({ route }: any) {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [myRating, setMyRating] = useState(0);
  const [myText, setMyText] = useState('');
  const [sending, setSending] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    getProduct(productId).then(setProduct);
    getFavouriteIds().then((ids) => setFav(ids.includes(productId)));
    listReviews(productId).then(setReviews);
  }, [productId]);

  const rating = summarize(reviews);

  const submitReview = async () => {
    if (myRating === 0 || sending) return;
    setSending(true);
    const review = await addReview(productId, user?.name ?? 'Anonymous', myRating, myText);
    setReviews((prev) => [review, ...prev]);
    setMyRating(0);
    setMyText('');
    setSending(false);
  };

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
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 24 }}>
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
        <Text testID="detail-rating" style={styles.ratingSummary}>
          {rating.count > 0
            ? `★ ${rating.average.toFixed(1)} · ${rating.count} review${rating.count === 1 ? '' : 's'}`
            : 'No reviews yet'}
        </Text>
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

      <View style={styles.reviewsCard}>
        <Text style={styles.reviewsTitle}>Reviews</Text>
        <View style={styles.writeRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <TouchableOpacity
              key={n}
              testID={`review-star-${n}`}
              onPress={() => setMyRating(n)}
              hitSlop={6}
            >
              <Text style={[styles.pickStar, n <= myRating && styles.pickStarOn]}>
                {n <= myRating ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          testID="review-input"
          style={styles.reviewInput}
          placeholder="What did you think of this product?"
          placeholderTextColor={colors.muted}
          value={myText}
          onChangeText={setMyText}
          multiline
        />
        <AppButton
          title={sending ? 'Sending...' : 'Submit review'}
          onPress={submitReview}
          testID="review-submit"
          style={myRating === 0 || sending ? styles.submitDisabled : undefined}
        />
        {reviews.map((r) => (
          <View key={r.id} testID="review-item" style={styles.reviewItem}>
            <View style={styles.reviewHead}>
              <Text style={styles.reviewAuthor}>{r.author}</Text>
              <Text style={styles.reviewStars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
            </View>
            {r.text !== '' && <Text style={styles.reviewText}>{r.text}</Text>}
          </View>
        ))}
      </View>
    </ScrollView>
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
  ratingSummary: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
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
  reviewsCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 16,
    marginTop: 12,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  writeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  pickStar: {
    fontSize: 28,
    color: colors.muted,
    marginRight: 6,
  },
  pickStarOn: {
    color: '#F59E0B',
  },
  reviewInput: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 12,
    minHeight: 64,
    fontSize: 15,
    color: colors.text,
    textAlignVertical: 'top',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 12,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewStars: {
    fontSize: 13,
    color: '#F59E0B',
  },
  reviewText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
});
