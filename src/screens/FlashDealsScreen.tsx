import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Product } from '../services/types';
import { getFlashDeals } from '../services/deals';

export default function FlashDealsScreen() {
  const [deals, setDeals] = useState<Product[]>([]);

  useEffect(() => {
    getFlashDeals().then(setDeals);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Today's deals</Text>
      <FlatList
        data={deals}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} - R$ {item.price.toFixed(2)}
          </Text>
        )}
      />
    </View>
  );
}
