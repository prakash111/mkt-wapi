import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/Button';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { useAuth } from '@/context/AuthContext';
import { spacing } from '@/theme';

export function MoreScreen() {
  const navigation = useNavigation<any>();
  const { signOut, user } = useAuth();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Title>More</Title>
          <Caption>{user?.name} · {user?.email}</Caption>
        </View>

        <SectionCard>
          <Subtitle>Growth & delivery</Subtitle>
          <View style={styles.grid}>
            <Button title="Campaigns" onPress={() => navigation.navigate('Campaigns')} />
            <Button title="WhatsApp Accounts" variant="secondary" onPress={() => navigation.navigate('WhatsAppAccounts')} />
          </View>
        </SectionCard>

        <SectionCard>
          <Subtitle>Billing</Subtitle>
          <View style={styles.grid}>
            <Button title="Subscription" onPress={() => navigation.navigate('Subscription')} />
            <Button title="Notifications" variant="secondary" onPress={() => navigation.navigate('Notifications')} />
          </View>
        </SectionCard>

        <SectionCard>
          <Subtitle>System</Subtitle>
          <View style={styles.grid}>
            <Button title="Settings" variant="secondary" onPress={() => navigation.navigate('Settings')} />
            <Button title="Sign out" variant="danger" onPress={() => signOut()} />
          </View>
        </SectionCard>

        <SectionCard>
          <Subtitle>What is native here?</Subtitle>
          <Body>
            Inbox, CRM views, push notifications, in-app notification center, WhatsApp account controls, and subscription purchase flow are implemented natively for mobile.
          </Body>
        </SectionCard>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing(2),
    paddingBottom: spacing(4),
  },
  header: {
    gap: spacing(0.5),
  },
  grid: {
    gap: spacing(1),
  },
});
