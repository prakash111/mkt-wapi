import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Body, Caption, Title } from '@/components/Typography';
import { useAuth } from '@/context/AuthContext';
import { palette, spacing } from '@/theme';

export function LoginScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Missing details', 'Enter email/phone and password');
      return;
    }

    try {
      setLoading(true);
      await signIn(identifier, password);
    } catch (error: any) {
      Alert.alert('Login failed', error?.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.root}>
      <View style={styles.hero}>
        <Title>Mobile Admin</Title>
        <Body>Native Android control room for chat, campaigns, CRM, billing, and subscriptions.</Body>
      </View>

      <SectionCard>
        <Caption>Email or phone</Caption>
        <TextField
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          placeholder="sales@example.com"
        />

        <Caption>Password</Caption>
        <TextField
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <Button
          title={loading ? 'Signing in...' : 'Sign in'}
          disabled={loading}
          onPress={handleLogin}
        />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    gap: spacing(2),
  },
  hero: {
    gap: spacing(1),
  },
});
