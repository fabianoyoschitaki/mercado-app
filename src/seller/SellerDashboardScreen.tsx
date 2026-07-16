import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors, radius } from '../theme';
import { getMyListings, setListingLive, centsToDisplay, Listing } from './api';

export default function SellerDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);

  const reload = useCallback(() => {
    if (user?.sellerId) {
      setListings(getMyListings(user.sellerId));
    }
  }, [user]);

  useFocusEffect(reload);

  if (!user?.isSeller) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: colors.muted }}>Sellers only</Text>
      </View>
    );
  }

  const liveCount = listings.filter((l) => l.live).length;

  return (
    <View style={styles.screen}>
      <Text testID="listing-stats" style={styles.stats}>
        {liveCount} live / {listings.length} listings
      </Text>
      <FlatList
        data={listings}
        keyExtractor={(l) => l.listingId}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => navigation.navigate('ListingDetail', { productId: item.listingId })}
            >
              <Text style={[styles.title, !item.live && { color: colors.muted }]}>
                {item.title} - {centsToDisplay(item.priceCents)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setListingLive(item.listingId, !item.live);
                reload();
              }}
              style={[styles.toggle, !item.live && styles.toggleRelist]}
            >
              <Text style={[styles.toggleLabel, !item.live && { color: colors.primary }]}>
                {item.live ? 'Delist' : 'Relist'}
              </Text>
            </TouchableOpacity>
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
  stats: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  toggle: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  toggleRelist: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
