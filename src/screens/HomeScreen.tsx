import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/Button';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { getDashboard, getSubscription } from '@/services/api/modules';
import { palette, spacing } from '@/theme';
import { formatCurrency } from '@/utils/helpers';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const dashboard = useQuery({ queryKey: ['dashboard'], queryFn: getDashboard });
  const subscription = useQuery({ queryKey: ['subscription'], queryFn: getSubscription });

  const stats = dashboard.data?.data || dashboard.data?.data?.data || {};

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Title>Control Room</Title>
          <Caption>Realtime visibility across messages, revenue, campaigns, and accounts.</Caption>
        </View>

        {(dashboard.isLoading || subscription.isLoading) ? (
          <ActivityIndicator color={palette.text} />
        ) : null}

        <View style={styles.grid}>
          <SectionCard style={styles.statCard}>
            <Caption>Contacts</Caption>
            <Subtitle>{stats?.counts?.contacts ?? stats?.contacts ?? '--'}</Subtitle>
          </SectionCard>
          <SectionCard style={styles.statCard}>
            <Caption>Campaigns</Caption>
            <Subtitle>{stats?.counts?.campaigns ?? stats?.campaigns ?? '--'}</Subtitle>
          </SectionCard>
          <SectionCard style={styles.statCard}>
            <Caption>Messages</Caption>
            <Subtitle>{stats?.counts?.messages ?? stats?.messages ?? '--'}</Subtitle>
          </SectionCard>
          <SectionCard style={styles.statCard}>
            <Caption>Sales</Caption>
            <Subtitle>{formatCurrency(stats?.sales_total ?? stats?.total_sales, '₹')}</Subtitle>
          </SectionCard>
        </View>

        <SectionCard>
          <Subtitle>Quick actions</Subtitle>
          <View style={styles.actions}>
            <Button title="Open Inbox" onPress={() => navigation.navigate('Inbox')} />
            <Button title="Campaigns" variant="secondary" onPress={() => navigation.navigate('Campaigns')} />
            <Button title="WhatsApp Accounts" variant="secondary" onPress={() => navigation.navigate('WhatsAppAccounts')} />
            <Button title="Subscription" variant="secondary" onPress={() => navigation.navigate('Subscription')} />
          </View>
        </SectionCard>

        <SectionCard>
          <Subtitle>Active plan</Subtitle>
          <Body>{subscription.data?.data?.plan_id && typeof subscription.data.data.plan_id !== 'string'
            ? subscription.data.data.plan_id.name
            : 'No active plan detected'}</Body>
          <Caption>Status: {subscription.data?.data?.status || '--'}</Caption>
          <Caption>Renews: {subscription.data?.data?.current_period_end || '--'}</Caption>
        </SectionCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing(2),
    paddingBottom: spacing(3),
  },
  header: {
    gap: spacing(0.5),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing(1.5),
  },
  statCard: {
    width: '47%',
  },
  actions: {
    gap: spacing(1),
  },
});
