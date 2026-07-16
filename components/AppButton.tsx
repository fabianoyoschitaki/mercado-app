import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius } from '../src/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  style?: ViewStyle;
  testID?: string;
};

export default function AppButton({ title, onPress, variant = 'primary', style, testID }: Props) {
  const isOutline = variant === 'outline';
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={[
        styles.base,
        isOutline && styles.outline,
        variant === 'danger' && { backgroundColor: colors.danger },
        style,
      ]}
    >
      <Text style={[styles.label, isOutline && { color: colors.primary }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
