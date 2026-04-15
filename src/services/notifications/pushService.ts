import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { AndroidColor, EventType } from '@notifee/react-native';
import messaging, { type FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { ensureNotificationChannels } from './channels';
import { registerDeviceToken, unregisterDeviceToken } from '@/services/api/modules';
import { makeId } from '@/utils/helpers';
import type { AppNotification } from '@/types';
import { navigate } from '@/navigation/navigationRef';

export function mapRemoteToLocalNotification(
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
): AppNotification {
  const data = remoteMessage.data || {};
  return {
    id: makeId('notif'),
    title: remoteMessage.notification?.title || data.title || 'New update',
    body: remoteMessage.notification?.body || data.body || 'You have a new alert',
    type: (data.type as AppNotification['type']) || 'system',
    createdAt: new Date().toISOString(),
    read: false,
    route: data.screen
      ? {
          screen: data.screen,
          params: data.contactId
            ? {
                contactId: data.contactId,
                contactName: data.contactName || '',
                whatsappPhoneNumberId: data.whatsappPhoneNumberId || '',
              }
            : undefined,
        }
      : undefined,
    raw: data as Record<string, string>,
  };
}

function channelIdForType(type?: string): string {
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

export async function requestNotificationPermission(): Promise<boolean> {
  await ensureNotificationChannels();

  if (Platform.OS !== 'android') return true;
  if (Platform.Version < 33) return true;

  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function registerForPush(): Promise<string | null> {
  const allowed = await requestNotificationPermission();
  if (!allowed) return null;

  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  if (token) {
    await registerDeviceToken({
      fcm_token: token,
      platform: 'android',
      device_name: Platform.constants?.Model || 'Android',
      notification_sound: true,
    });
  }
  return token;
}

export async function unregisterPushToken(token: string): Promise<void> {
  await unregisterDeviceToken({ fcm_token: token });
}

export function bindForegroundPushHandlers(
  onLocalNotification: (notification: AppNotification) => void,
): Array<() => void> {
  const unsubscribeMessage = messaging().onMessage(async (remoteMessage) => {
    const local = mapRemoteToLocalNotification(remoteMessage);
    onLocalNotification(local);

    await notifee.displayNotification({
      title: local.title,
      body: local.body,
      android: {
        channelId: channelIdForType(local.type),
        pressAction: { id: 'default' },
        color: AndroidColor.BLUE,
        smallIcon: 'ic_launcher',
      },
      data: local.raw,
    });
  });

  const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (token) => {
    await registerDeviceToken({
      fcm_token: token,
      platform: 'android',
      device_name: Platform.constants?.Model || 'Android',
      notification_sound: true,
    });
  });

  const unsubscribeForegroundEvent = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data?.screen) {
      const data = detail.notification.data as Record<string, string>;
      navigate(data.screen, {
        contactId: data.contactId,
        contactName: data.contactName,
        whatsappPhoneNumberId: data.whatsappPhoneNumberId,
      });
    }
  });

  return [unsubscribeMessage, unsubscribeTokenRefresh, unsubscribeForegroundEvent];
}
