import React from 'react';
import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { palette, radius, spacing } from '@/theme';

export function TextField(props: TextInputProps) {
  return (
    <View style={styles.wrapper}>
      <TextInput
        {...props}
        placeholderTextColor={palette.muted}
        style={[styles.input, props.style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: palette.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  input: {
    color: palette.text,
    minHeight: 48,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.25),
  },
});
