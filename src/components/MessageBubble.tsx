import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Body, Caption } from '@/components/Typography';
import type { ChatMessage } from '@/types';
import { palette, radius, spacing } from '@/theme';
import { formatDate } from '@/utils/helpers';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const outbound = message.direction === 'outbound';

  return (
    <View style={[styles.row, outbound ? styles.rowOut : styles.rowIn]}>
      <View style={[styles.bubble, outbound ? styles.bubbleOut : styles.bubbleIn]}>
        <Body>{message.content || `[${message.messageType || 'message'}]`}</Body>
        <Caption style={styles.time}>{formatDate(message.createdAt)}</Caption>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    marginBottom: spacing(1),
  },
  rowOut: {
    alignItems: 'flex-end',
  },
  rowIn: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.25),
    gap: spacing(0.5),
  },
  bubbleOut: {
    backgroundColor: palette.primarySoft,
    borderBottomRightRadius: 6,
  },
  bubbleIn: {
    backgroundColor: palette.card,
    borderBottomLeftRadius: 6,
  },
  time: {
    alignSelf: 'flex-end',
  },
});
