import React, { useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { SectionCard } from '@/components/SectionCard';
import { Body, Caption, Title } from '@/components/Typography';
import { getConnections, getMyPhoneNumbers, setPrimaryPhoneNumber } from '@/services/api/modules';
import { extractArray } from '@/utils/helpers';
import type { ConnectionRecord, PhoneNumberRecord } from '@/types';
import { palette, spacing } from '@/theme';

export function WhatsAppAccountsScreen() {
  const queryClient = useQueryClient();
  const connections = useQuery({ queryKey: ['connections'], queryFn: getConnections });
  const phones = useQuery({ queryKey: ['phoneNumbers'], queryFn: getMyPhoneNumbers });

  const phoneNumbers = useMemo(
    () => extractArray<PhoneNumberRecord>(phones.data, ['data']),
    [phones.data],
  );
  const connectionList = useMemo(
    () => extractArray<ConnectionRecord>(connections.data, ['data']),
    [connections.data],
  );

  const setPrimaryMutation = useMutation({
    mutationFn: (id: string) => setPrimaryPhoneNumber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    onError: (error: any) => Alert.alert('Unable to update', error?.message || 'Could not set primary phone'),
  });

  return (
    <Screen>
      <View style={styles.header}>
        <Title>WhatsApp Accounts</Title>
        <Caption>Manage active phone numbers and primary routing from mobile.</Caption>
      </View>

      {(connections.isLoading || phones.isLoading) ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <FlatList
          data={phoneNumbers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SectionCard>
              <ListRow
                title={item.display_phone_number}
                subtitle={item.is_primary ? 'Primary outbound line' : 'Secondary line'}
                right={<Badge label={item.is_primary ? 'Primary' : 'Available'} tone={item.is_primary ? 'success' : 'default'} />}
              />
              {!item.is_primary ? (
                <Button
                  title={setPrimaryMutation.isPending ? 'Updating...' : 'Set as primary'}
                  onPress={() => setPrimaryMutation.mutate(item.id)}
                />
              ) : null}
            </SectionCard>
          )}
          ListHeaderComponent={
            <SectionCard style={styles.summaryCard}>
              <Body>Connections found: {connectionList.length}</Body>
              <Body>Phone numbers: {phoneNumbers.length}</Body>
            </SectionCard>
          }
          ListEmptyComponent={<Body>No active WhatsApp numbers found.</Body>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(0.5),
    marginBottom: spacing(1.5),
  },
  summaryCard: {
    marginBottom: spacing(1),
  },
  list: {
    gap: spacing(1),
    paddingBottom: spacing(4),
  },
});
