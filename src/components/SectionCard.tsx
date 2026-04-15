import React from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { palette, radius, spacing } from '@/theme';

export function SectionCard({ children, style, ...props }: ViewProps) {
  return (
    <View {...props} style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing(2),
    gap: spacing(1.25),
  },
});
