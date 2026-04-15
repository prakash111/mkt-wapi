import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { ListRow } from '@/components/ListRow';
import { Button } from '@/components/Button';
import { SectionCard } from '@/components/SectionCard';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { createCampaign, getCampaigns, getMyPhoneNumbers, sendCampaign } from '@/services/api/modules';
import { extractArray } from '@/utils/helpers';
import type { CampaignRecord, PhoneNumberRecord } from '@/types';
import { palette, spacing } from '@/theme';

export function CampaignsScreen() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const campaignsQuery = useQuery({ queryKey: ['campaigns'], queryFn: () => getCampaigns({ limit: 50 }) });
  const phoneNumbersQuery = useQuery({ queryKey: ['phoneNumbers'], queryFn: getMyPhoneNumbers });

  const campaigns = useMemo(
    () => extractArray<CampaignRecord>(campaignsQuery.data, ['data']),
    [campaignsQuery.data],
  );
  const phoneNumbers = useMemo(
    () => extractArray<PhoneNumberRecord>(phoneNumbersQuery.data, ['data']),
    [phoneNumbersQuery.data],
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      const phone = phoneNumbers[0];
      return createCampaign({
        name,
        campaign_type: 'manual',
        content: message,
        whatsapp_phone_number_id: phone?.id,
      });
    },
    onSuccess: () => {
      setEditorOpen(false);
      setName('');
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
    onError: (error: any) => Alert.alert('Unable to create', error?.message || 'Campaign create failed'),
  });

  const sendMutation = useMutation({
    mutationFn: (id: string) => sendCampaign(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
    onError: (error: any) => Alert.alert('Unable to send', error?.message || 'Campaign send failed'),
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Campaigns</Title>
        <Caption>List, create, and launch campaign sends from mobile.</Caption>
        <Button title="Create Campaign" onPress={() => setEditorOpen(true)} />
      </View>

      {campaignsQuery.isLoading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <FlatList
          data={campaigns}
          keyExtractor={(item, index) => item._id || item.id || `campaign-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SectionCard>
              <ListRow
                title={item.name || 'Untitled campaign'}
                subtitle={`Status: ${item.status || '--'}`}
                meta={item.created_at}
              />
              <Button
                title={sendMutation.isPending ? 'Sending...' : 'Send now'}
                onPress={() => sendMutation.mutate((item._id || item.id) as string)}
              />
            </SectionCard>
          )}
          ListEmptyComponent={<Body>No campaigns found.</Body>}
        />
      )}

      <Modal visible={editorOpen} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <SectionCard style={styles.modalCard}>
            <Subtitle>Create campaign</Subtitle>
            <Caption>
              This mobile composer sends a compact payload. Expand fields here if your backend requires template ids,
              schedule times, or segment filters.
            </Caption>
            <TextField placeholder="Campaign name" value={name} onChangeText={setName} />
            <TextField placeholder="Message / content" value={message} onChangeText={setMessage} multiline style={styles.multiline} />
            <View style={styles.modalActions}>
              <Button title="Cancel" variant="secondary" onPress={() => setEditorOpen(false)} />
              <Button
                title={createMutation.isPending ? 'Saving...' : 'Save'}
                disabled={createMutation.isPending}
                onPress={() => createMutation.mutate()}
              />
            </View>
          </SectionCard>
        </View>
      </Modal>
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
    paddingBottom: spacing(4),
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'flex-end',
    padding: spacing(2),
  },
  modalCard: {
    gap: spacing(1.25),
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing(1),
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
