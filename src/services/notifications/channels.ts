import notifee, { AndroidImportance } from '@notifee/react-native';

export async function ensureNotificationChannels(): Promise<void> {
  await notifee.createChannel({
    id: 'chat_messages',
    name: 'Chat messages',
    importance: AndroidImportance.HIGH,
    vibration: true,
    lights: true,
  });

  await notifee.createChannel({
    id: 'campaign_updates',
    name: 'Campaign updates',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    lights: true,
  });

  await notifee.createChannel({
    id: 'billing',
    name: 'Billing and subscription',
    importance: AndroidImportance.HIGH,
    vibration: true,
    lights: true,
  });

  await notifee.createChannel({
    id: 'system',
    name: 'System alerts',
    importance: AndroidImportance.DEFAULT,
    vibration: true,
    lights: true,
  });

  await notifee.createChannel({
    id: 'active_desk',
    name: 'Active desk mode',
    importance: AndroidImportance.LOW,
    vibration: false,
    lights: false,
  });
}
