import notifee from '@notifee/react-native';

export async function startActiveDeskMode(): Promise<void> {
  await notifee.displayNotification({
    id: 'active-desk-mode',
    title: 'Active desk mode enabled',
    body: 'Realtime operator mode is active. Keep this notification running during work hours.',
    android: {
      channelId: 'active_desk',
      asForegroundService: true,
      pressAction: {
        id: 'default',
      },
      ongoing: true,
    },
  });
}

export async function stopActiveDeskMode(): Promise<void> {
  await notifee.cancelNotification('active-desk-mode');
}
