import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Body, Caption, Subtitle } from '@/components/Typography';
import { palette, radius, spacing } from '@/theme';
import type { AppNotification } from '@/types';

export function InAppBanner({
  notification,
  onPress,
  onDismiss,
}: {
  notification: AppNotification | null;
  onPress: () => void;
  onDismiss: () => void;
}) {
  if (!notification) return null;

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={styles.content}>
        <Caption>{notification.type.toUpperCase()}</Caption>
        <Subtitle>{notification.title}</Subtitle>
        <Body>{notification.body}</Body>
      </View>
      <Pressable onPress={onDismiss} style={styles.close}>
        <Caption>Dismiss</Caption>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: palette.card,
    borderColor: palette.primary,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing(1.5),
    gap: spacing(1),
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: spacing(0.25),
  },
  close: {
    padding: spacing(0.5),
  },
});
