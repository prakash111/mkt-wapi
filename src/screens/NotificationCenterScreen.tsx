import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { Body, Title } from '@/components/Typography';
import { useNotificationCenter } from '@/context/NotificationCenterContext';
import { formatDate } from '@/utils/helpers';
import { spacing } from '@/theme';

export function NotificationCenterScreen() {
  const { notifications, markAllRead, markRead, removeNotification } = useNotificationCenter();

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Notifications</Title>
        <Button title="Mark all read" variant="secondary" onPress={markAllRead} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ListRow
            title={item.title}
            subtitle={item.body}
            meta={`${item.read ? 'Read' : 'Unread'} • ${formatDate(item.createdAt)}`}
            right={
              <View style={styles.actions}>
                {!item.read ? <Button title="Read" variant="secondary" onPress={() => markRead(item.id)} /> : null}
                <Button title="Delete" variant="danger" onPress={() => removeNotification(item.id)} />
              </View>
            }
          />
        )}
        ListEmptyComponent={<Body>No notifications yet.</Body>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(1),
    marginBottom: spacing(1.5),
  },
  list: {
    gap: spacing(1),
    paddingBottom: spacing(4),
  },
  actions: {
    gap: spacing(0.5),
  },
});
