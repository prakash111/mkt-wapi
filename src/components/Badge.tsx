import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';

export function Badge({
  label,
  tone = 'default',
}: {
  label: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'primary';
}) {
  return (
    <View
      style={[
        styles.wrap,
        tone === 'success' && { backgroundColor: '#1D5B3C' },
        tone === 'warning' && { backgroundColor: '#5E4517' },
        tone === 'danger' && { backgroundColor: '#5B2020' },
        tone === 'primary' && { backgroundColor: palette.primarySoft },
      ]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    backgroundColor: palette.cardSoft,
    paddingHorizontal: spacing(1),
    paddingVertical: spacing(0.5),
    borderRadius: radius.sm,
  },
  text: {
    color: palette.text,
    fontSize: 11,
    fontWeight: '600',
  },
});
