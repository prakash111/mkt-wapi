import { useEffect } from 'react';
import { bindForegroundPushHandlers, registerForPush } from '@/services/notifications/pushService';
import { useNotificationCenter } from '@/context/NotificationCenterContext';

export function usePushBootstrap(enabled: boolean) {
  const { addNotification } = useNotificationCenter();

  useEffect(() => {
    if (!enabled) return;

    let unsubscribers: Array<() => void> = [];

    registerForPush().catch(() => null);
    unsubscribers = bindForegroundPushHandlers(addNotification);

    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [enabled, addNotification]);
}
