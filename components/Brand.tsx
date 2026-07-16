import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../src/theme';

type Props = {
  size?: 'sm' | 'lg';
  tagline?: boolean;
};

export default function Brand({ size = 'sm', tagline = false }: Props) {
  const large = size === 'lg';
  return (
    <View style={[styles.row, large && styles.column]}>
      <View style={[styles.mark, large && styles.markLg]}>
        <Text style={[styles.markGlyph, large && styles.markGlyphLg]}>🛒</Text>
      </View>
      <Text style={[styles.wordmark, large && styles.wordmarkLg]}>Mercado</Text>
      {tagline && <Text style={styles.tagline}>Fresh groceries from local sellers</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  mark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  markLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 0,
    marginBottom: 12,
  },
  markGlyph: {
    fontSize: 14,
  },
  markGlyphLg: {
    fontSize: 34,
  },
  wordmark: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primaryDark,
    letterSpacing: 0.3,
  },
  wordmarkLg: {
    fontSize: 30,
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    color: colors.muted,
  },
});
