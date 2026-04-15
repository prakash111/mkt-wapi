import React from 'react';
import { Text, StyleSheet, type TextProps } from 'react-native';
import { palette } from '@/theme';

export function Title(props: TextProps) {
  return <Text {...props} style={[styles.title, props.style]} />;
}

export function Subtitle(props: TextProps) {
  return <Text {...props} style={[styles.subtitle, props.style]} />;
}

export function Body(props: TextProps) {
  return <Text {...props} style={[styles.body, props.style]} />;
}

export function Caption(props: TextProps) {
  return <Text {...props} style={[styles.caption, props.style]} />;
}

const styles = StyleSheet.create({
  title: {
    color: palette.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: palette.text,
    fontSize: 16,
    fontWeight: '600',
  },
  body: {
    color: palette.text,
    fontSize: 14,
  },
  caption: {
    color: palette.muted,
    fontSize: 12,
  },
});
