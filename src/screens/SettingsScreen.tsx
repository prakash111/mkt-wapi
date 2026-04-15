import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SectionCard } from '@/components/SectionCard';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { Body, Caption, Subtitle, Title } from '@/components/Typography';
import { DEFAULT_RUNTIME_CONFIG, getRuntimeConfig, saveRuntimeConfig } from '@/config/runtime';
import { startActiveDeskMode, stopActiveDeskMode } from '@/services/notifications/liveDesk';
import { spacing } from '@/theme';

export function SettingsScreen() {
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_RUNTIME_CONFIG.apiBaseUrl);
  const [socketBaseUrl, setSocketBaseUrl] = useState(DEFAULT_RUNTIME_CONFIG.socketBaseUrl);
  const [storageBaseUrl, setStorageBaseUrl] = useState(DEFAULT_RUNTIME_CONFIG.storageBaseUrl);
  const [activeDeskMode, setActiveDeskMode] = useState(false);

  useEffect(() => {
    getRuntimeConfig().then((config) => {
      setApiBaseUrl(config.apiBaseUrl);
      setSocketBaseUrl(config.socketBaseUrl);
      setStorageBaseUrl(config.storageBaseUrl);
    });
  }, []);

  const save = async () => {
    await saveRuntimeConfig({
      apiBaseUrl,
      socketBaseUrl,
      storageBaseUrl,
      appName: DEFAULT_RUNTIME_CONFIG.appName,
    });
    Alert.alert('Saved', 'Runtime configuration updated.');
  };

  const toggleActiveDeskMode = async (value: boolean) => {
    setActiveDeskMode(value);
    if (value) {
      await startActiveDeskMode();
    } else {
      await stopActiveDeskMode();
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Title>Settings</Title>
        <Caption>Change API routing and operator behavior without rebuilding the app.</Caption>
      </View>

      <SectionCard>
        <Subtitle>Runtime endpoints</Subtitle>
        <TextField value={apiBaseUrl} onChangeText={setApiBaseUrl} placeholder="API base URL" autoCapitalize="none" />
        <TextField value={socketBaseUrl} onChangeText={setSocketBaseUrl} placeholder="Socket base URL" autoCapitalize="none" />
        <TextField value={storageBaseUrl} onChangeText={setStorageBaseUrl} placeholder="Storage base URL" autoCapitalize="none" />
        <Button title="Save endpoints" onPress={save} />
      </SectionCard>

      <SectionCard>
        <Subtitle>Realtime desk mode</Subtitle>
        <Body>
          When enabled, the app shows a persistent operator notification during work hours. Use it only when you actively monitor chats.
        </Body>
        <View style={styles.row}>
          <Caption>{activeDeskMode ? 'Enabled' : 'Disabled'}</Caption>
          <Switch value={activeDeskMode} onValueChange={toggleActiveDeskMode} />
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing(0.5),
    marginBottom: spacing(1.5),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
