import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CurrentUser } from '@/types';

const SESSION_KEY = 'auth-session:v1';

export async function saveSession(token: string, user: CurrentUser): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ token, user }));
}

export async function getSession(): Promise<{ token: string; user: CurrentUser } | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { token: string; user: CurrentUser };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
