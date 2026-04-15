import React, { useEffect, useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { getPlans, getSubscription } from '@/services/api/modules';
import { buyPlan, loadSubscriptionProducts, startIapConnection, stopIapConnection } from '@/services/billing/iapService';
import { extractArray, formatCurrency } from '@/utils/helpers';
import type { PlanRecord } from '@/types';
import { palette, spacing } from '@/theme';

export function SubscriptionScreen() {
  const queryClient = useQueryClient();

  useEffect(() => {
    startIapConnection().catch(() => null);
    return () => {
      stopIapConnection().catch(() => null);
    };
  }, []);

  const subscriptionQuery = useQuery({ queryKey: ['subscription'], queryFn: getSubscription });
  const plansQuery = useQuery({ queryKey: ['plans'], queryFn: getPlans });

  const plans = useMemo(() => extractArray<PlanRecord>(plansQuery.data, ['data']), [plansQuery.data]);

  useQuery({
    queryKey: ['iapProducts', plans.map((plan) => plan.android_product_id).join(',')],
    queryFn: () => loadSubscriptionProducts(plans),
    enabled: plans.length > 0,
  });

  const purchaseMutation = useMutation({
    mutationFn: (plan: PlanRecord) => buyPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
    onError: (error: any) => {
      Alert.alert('Purchase failed', error?.message || 'Unable to start purchase flow');
    },
  });

  const currentPlan =
    subscriptionQuery.data?.data?.plan_id && typeof subscriptionQuery.data.data.plan_id !== 'string'
      ? subscriptionQuery.data.data.plan_id
      : null;

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Subscription</Title>
        <Caption>Native billing screen for active plan, usage, and Google Play purchase launch.</Caption>
      </View>

      {subscriptionQuery.isLoading || plansQuery.isLoading ? (
        <ActivityIndicator color={palette.text} />
      ) : null}

      <SectionCard>
        <Subtitle>Current subscription</Subtitle>
        <Body>{currentPlan?.name || 'No active plan'}</Body>
        <Caption>Status: {subscriptionQuery.data?.data?.status || '--'}</Caption>
        <Caption>Renews: {subscriptionQuery.data?.data?.current_period_end || '--'}</Caption>
        <Caption>Paid: {formatCurrency(subscriptionQuery.data?.data?.amount_paid, subscriptionQuery.data?.data?.currency || '₹')}</Caption>
      </SectionCard>

      <FlatList
        data={plans}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <SectionCard>
            <View style={styles.row}>
              <Subtitle>{item.name}</Subtitle>
              <Badge label={item.billing_cycle} tone="primary" />
            </View>
            <Body>{item.description || 'No description provided'}</Body>
            <Caption>{formatCurrency(item.price, item.currency || '₹')}</Caption>
            <Caption>Play SKU: {item.android_product_id || 'Not configured'}</Caption>
            <Button
              title={purchaseMutation.isPending ? 'Opening purchase...' : 'Buy in app'}
              disabled={!item.android_product_id || purchaseMutation.isPending}
              onPress={() => purchaseMutation.mutate(item)}
            />
          </SectionCard>
        )}
        ListEmptyComponent={<Body>No active plans available.</Body>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(0.5),
    marginBottom: spacing(1.5),
  },
  list: {
    gap: spacing(1),
    paddingVertical: spacing(1.5),
    paddingBottom: spacing(4),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
