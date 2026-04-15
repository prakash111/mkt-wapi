import React from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { palette, radius, spacing } from '@/theme';

export function Button({
  title,
  variant = 'primary',
  ...props
}: PressableProps & { title: string; variant?: 'primary' | 'secondary' | 'danger' }) {
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && styles.pressed,
        typeof props.style === 'function' ? undefined : props.style,
      ]}>
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(2),
  },
  primary: {
    backgroundColor: palette.primary,
  },
  secondary: {
    backgroundColor: palette.cardSoft,
    borderWidth: 1,
    borderColor: palette.border,
  },
  danger: {
    backgroundColor: palette.danger,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: palette.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
