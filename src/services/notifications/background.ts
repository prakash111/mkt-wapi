import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, { AndroidImportance, type Event } from '@notifee/react-native';
import type { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { ensureNotificationChannels } from './channels';

const PENDING_ROUTE_KEY = 'pending-notification-route:v1';

function mapTypeToChannel(type?: string): string {
  switch (type) {
    case 'chat':
      return 'chat_messages';
    case 'campaign':
      return 'campaign_updates';
    case 'billing':
      return 'billing';
    default:
      return 'system';
  }
}

export async function savePendingRoute(route?: Record<string, string>): Promise<void> {
  if (!route) return;
  await AsyncStorage.setItem(PENDING_ROUTE_KEY, JSON.stringify(route));
}

export async function consumePendingRoute(): Promise<Record<string, string> | null> {
  const raw = await AsyncStorage.getItem(PENDING_ROUTE_KEY);
  if (!raw) return null;
  await AsyncStorage.removeItem(PENDING_ROUTE_KEY);
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return null;
  }
}

export async function handleBackgroundMessage(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): Promise<void> {
  await ensureNotificationChannels();
  const data = remoteMessage.data || {};
  const title = remoteMessage.notification?.title || data.title || 'New activity';
  const body = remoteMessage.notification?.body || data.body || 'You have a new update';
  const type = data.type || 'system';

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: mapTypeToChannel(type),
      pressAction: { id: 'default' },
      smallIcon: 'ic_launcher',
      timestamp: Date.now(),
      showTimestamp: true,
      importance: AndroidImportance.HIGH,
    },
    data,
  });
}

export async function handleBackgroundNotifeeEvent(event: Event): Promise<void> {
  if (!event.detail.notification?.data) return;
  await savePendingRoute(event.detail.notification.data as Record<string, string>);
}
