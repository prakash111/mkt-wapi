import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Body, Caption, Subtitle } from '@/components/Typography';
import { palette, radius, spacing } from '@/theme';

export function ListRow({
  title,
  subtitle,
  meta,
  onPress,
  right,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.grow}>
        <Subtitle>{title}</Subtitle>
        {subtitle ? <Body>{subtitle}</Body> : null}
        {meta ? <Caption>{meta}</Caption> : null}
      </View>
      {right}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing(1.5),
    backgroundColor: palette.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  grow: {
    flex: 1,
    gap: spacing(0.5),
  },
});
