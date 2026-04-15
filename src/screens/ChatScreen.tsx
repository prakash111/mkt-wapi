import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { MessageBubble } from '@/components/MessageBubble';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Body, Caption, Title } from '@/components/Typography';
import { getMessages, getMyPhoneNumbers, sendTextMessage } from '@/services/api/modules';
import { extractArray } from '@/utils/helpers';
import type { ChatMessage, PhoneNumberRecord } from '@/types';
import { palette, spacing } from '@/theme';

function flattenMessages(payload: any): ChatMessage[] {
  const groups = payload?.messages || [];
  const flattened: ChatMessage[] = [];

  for (const dateGroup of groups) {
    for (const messageGroup of dateGroup?.messageGroups || []) {
      for (const message of messageGroup?.messages || []) {
        flattened.push({
          id: message.id,
          content: message.content,
          createdAt: message.createdAt,
          direction: message.direction === 'outbound' ? 'outbound' : 'inbound',
          messageType: message.messageType,
          fileUrl: message.fileUrl,
          sender: message.sender,
          recipient: message.recipient,
        });
      }
    }
  }

  return flattened.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
}

export function ChatScreen({ route }: any) {
  const contactId = route.params?.contactId as string;
  const contactName = route.params?.contactName as string;
  const routePhoneId = route.params?.whatsappPhoneNumberId as string | undefined;

  const [text, setText] = useState('');
  const queryClient = useQueryClient();

  const phonesQuery = useQuery({
    queryKey: ['phoneNumbers'],
    queryFn: getMyPhoneNumbers,
  });

  const selectedPhoneId =
    routePhoneId ||
    (extractArray<PhoneNumberRecord>(phonesQuery.data, ['data'])[0]?.id || '');

  const messagesQuery = useQuery({
    queryKey: ['messages', contactId, selectedPhoneId],
    queryFn: () => getMessages(contactId, selectedPhoneId),
    enabled: !!contactId,
  });

  const messages = useMemo(() => flattenMessages(messagesQuery.data), [messagesQuery.data]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPhoneId) throw new Error('No active WhatsApp number selected');
      return sendTextMessage({
        contact_id: contactId,
        whatsapp_phone_number_id: selectedPhoneId,
        message: text.trim(),
      });
    },
    onSuccess: () => {
      setText('');
      queryClient.invalidateQueries({ queryKey: ['messages', contactId, selectedPhoneId] });
      queryClient.invalidateQueries({ queryKey: ['recentChats'] });
    },
    onError: (error: any) => {
      Alert.alert('Send failed', error?.message || 'Unable to send this message');
    },
  });

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <Title>{contactName || 'Conversation'}</Title>
          <Caption>Phone line: {selectedPhoneId || 'Select a primary number in Accounts'}</Caption>
        </View>

        {messagesQuery.isLoading ? (
          <ActivityIndicator color={palette.text} />
        ) : (
          <FlatList
            style={styles.list}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            ListEmptyComponent={<Body>No messages yet.</Body>}
            contentContainerStyle={styles.listContent}
          />
        )}

        <View style={styles.composer}>
          <TextField
            value={text}
            onChangeText={setText}
            placeholder="Reply to customer..."
            multiline
            style={styles.input}
          />
          <Button
            title={sendMutation.isPending ? 'Sending...' : 'Send'}
            disabled={sendMutation.isPending || !text.trim()}
            onPress={() => sendMutation.mutate()}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: spacing(1.5),
  },
  top: {
    gap: spacing(0.5),
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing(1.5),
  },
  composer: {
    gap: spacing(1),
    paddingBottom: spacing(1),
  },
  input: {
    minHeight: 78,
    textAlignVertical: 'top',
  },
});
