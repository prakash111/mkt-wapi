import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ListRow } from '@/components/ListRow';
import { SectionCard } from '@/components/SectionCard';
import { Body, Caption, Title } from '@/components/Typography';
import { getInvoices, getLiteCrmSummary, getMyPhoneNumbers, getQuotations, getSales, sendInvoiceOnWhatsapp, sendQuotationOnWhatsapp } from '@/services/api/modules';
import { extractArray, formatCurrency } from '@/utils/helpers';
import type { CrmRecord, PhoneNumberRecord } from '@/types';
import { palette, spacing } from '@/theme';

type Segment = 'invoices' | 'quotations' | 'sales';

export function CrmHubScreen() {
  const [segment, setSegment] = useState<Segment>('invoices');
  const summary = useQuery({ queryKey: ['crmSummary'], queryFn: getLiteCrmSummary });
  const invoices = useQuery({ queryKey: ['crmInvoices'], queryFn: () => getInvoices({ limit: 30 }) });
  const quotations = useQuery({ queryKey: ['crmQuotations'], queryFn: () => getQuotations({ limit: 30 }) });
  const sales = useQuery({ queryKey: ['crmSales'], queryFn: () => getSales({ limit: 30 }) });
  const phones = useQuery({ queryKey: ['phoneNumbers'], queryFn: getMyPhoneNumbers });

  const primaryPhone = useMemo(
    () => extractArray<PhoneNumberRecord>(phones.data, ['data'])[0]?.id,
    [phones.data],
  );

  const sendInvoiceMutation = useMutation({
    mutationFn: (id: string) => sendInvoiceOnWhatsapp(id, primaryPhone),
  });

  const sendQuotationMutation = useMutation({
    mutationFn: (id: string) => sendQuotationOnWhatsapp(id, primaryPhone),
  });

  const activeData = useMemo(() => {
    if (segment === 'quotations') return extractArray<CrmRecord>(quotations.data, ['data']);
    if (segment === 'sales') return extractArray<CrmRecord>(sales.data, ['data']);
    return extractArray<CrmRecord>(invoices.data, ['data']);
  }, [segment, quotations.data, sales.data, invoices.data]);

  const activeLoading =
    segment === 'quotations' ? quotations.isLoading : segment === 'sales' ? sales.isLoading : invoices.isLoading;

  return (
    <Screen>
      <View style={styles.header}>
        <Title>CRM Hub</Title>
        <Caption>Monitor invoices, quotations, and sales. Send commercial documents to WhatsApp in one tap.</Caption>
      </View>

      <SectionCard>
        <View style={styles.pills}>
          <Button title="Invoices" variant={segment === 'invoices' ? 'primary' : 'secondary'} onPress={() => setSegment('invoices')} />
          <Button title="Quotations" variant={segment === 'quotations' ? 'primary' : 'secondary'} onPress={() => setSegment('quotations')} />
          <Button title="Sales" variant={segment === 'sales' ? 'primary' : 'secondary'} onPress={() => setSegment('sales')} />
        </View>

        <View style={styles.summaryRow}>
          <Badge label={`Summary: ${summary.data?.data?.counts?.documents || 'live'}`} tone="primary" />
          <Badge label={`Primary line: ${primaryPhone || '--'}`} />
        </View>
      </SectionCard>

      {activeLoading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <FlatList
          data={activeData}
          keyExtractor={(item, index) => item._id || item.id || `${segment}-${index}`}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <SectionCard>
              <ListRow
                title={item.number || item.customer_name || 'CRM record'}
                subtitle={`Status: ${item.status || '--'}`}
                meta={item.created_at}
                right={<Badge label={formatCurrency(item.total, '₹')} tone="success" />}
              />
              {segment === 'invoices' ? (
                <Button title={sendInvoiceMutation.isPending ? 'Sending...' : 'Send on WhatsApp'} onPress={() => sendInvoiceMutation.mutate((item._id || item.id) as string)} />
              ) : null}
              {segment === 'quotations' ? (
                <Button title={sendQuotationMutation.isPending ? 'Sending...' : 'Send on WhatsApp'} onPress={() => sendQuotationMutation.mutate((item._id || item.id) as string)} />
              ) : null}
            </SectionCard>
          )}
          ListEmptyComponent={<Body>No {segment} found.</Body>}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(0.75),
    marginBottom: spacing(1.5),
  },
  pills: {
    gap: spacing(1),
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1),
  },
  list: {
    gap: spacing(1),
    paddingVertical: spacing(1.5),
    paddingBottom: spacing(4),
  },
});
