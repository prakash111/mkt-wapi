import AsyncStorage from '@react-native-async-storage/async-storage';

export type RuntimeConfig = {
  apiBaseUrl: string;
  socketBaseUrl: string;
  storageBaseUrl: string;
  appName: string;
};

const KEY = 'runtime-config:v1';

export const DEFAULT_RUNTIME_CONFIG: RuntimeConfig = {
  apiBaseUrl: 'https://api.zoomnearby.com/api',
  socketBaseUrl: 'https://api.zoomnearby.com',
  storageBaseUrl: 'https://api.zoomnearby.com',
  appName: 'ZoomNearby Mobile',
};

export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return DEFAULT_RUNTIME_CONFIG;
  try {
    return { ...DEFAULT_RUNTIME_CONFIG, ...(JSON.parse(raw) as Partial<RuntimeConfig>) };
  } catch {
    return DEFAULT_RUNTIME_CONFIG;
  }
}

export async function saveRuntimeConfig(config: RuntimeConfig): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(config));
}
