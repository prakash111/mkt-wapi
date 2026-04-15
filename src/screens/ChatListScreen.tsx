import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { ListRow } from '@/components/ListRow';
import { Badge } from '@/components/Badge';
import { Body, Title } from '@/components/Typography';
import { getRecentChats } from '@/services/api/modules';
import { extractArray } from '@/utils/helpers';
import { palette, spacing } from '@/theme';
import type { RecentChatItem } from '@/types';

export function ChatListScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const query = useQuery({
    queryKey: ['recentChats', search],
    queryFn: () => getRecentChats(search ? { search } : undefined),
  });

  const data = useMemo(
    () => extractArray<RecentChatItem>(query.data, ['data']),
    [query.data],
  );

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Inbox</Title>
        <TextField placeholder="Search contact or number" value={search} onChangeText={setSearch} />
      </View>

      {query.isLoading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.contact.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ListRow
              title={item.contact.name || item.contact.number || 'Unknown contact'}
              subtitle={item.lastMessage.content || `[${item.lastMessage.messageType || 'message'}]`}
              meta={item.lastMessage.createdAt}
              onPress={() =>
                navigation.navigate('ChatThread', {
                  contactId: item.contact.id,
                  contactName: item.contact.name || item.contact.number || 'Unknown contact',
                })
              }
              right={
                item.lastMessage.unreadCount ? (
                  <Badge label={String(item.lastMessage.unreadCount)} tone="primary" />
                ) : undefined
              }
            />
          )}
          ListEmptyComponent={<Body>No conversations found.</Body>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(1.5),
    marginBottom: spacing(1.5),
  },
  list: {
    gap: spacing(1),
    paddingBottom: spacing(3),
  },
});
