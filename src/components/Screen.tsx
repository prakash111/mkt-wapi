import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View, type ViewStyle } from 'react-native';
import { palette, spacing } from '@/theme';

export function Screen({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing(2),
    paddingTop: spacing(1.5),
  },
});
