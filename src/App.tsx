import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@/navigation/AppNavigator';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationCenterProvider, useNotificationCenter } from '@/context/NotificationCenterContext';
import { InAppBanner } from '@/components/InAppBanner';
import { consumePendingRoute } from '@/services/notifications/background';
import { navigate } from '@/navigation/navigationRef';
import { usePushBootstrap } from '@/hooks/usePushBootstrap';
import { useRealtimeBridge } from '@/hooks/useRealtimeBridge';
import { palette, spacing } from '@/theme';

const queryClient = new QueryClient();

function Shell() {
  const { token } = useAuth();
  const { notifications, markRead } = useNotificationCenter();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  usePushBootstrap(Boolean(token));
  useRealtimeBridge(Boolean(token));

  React.useEffect(() => {
    consumePendingRoute().then((route) => {
      if (route?.screen) {
        navigate(route.screen, {
          contactId: route.contactId,
          contactName: route.contactName,
          whatsappPhoneNumberId: route.whatsappPhoneNumberId,
        });
      }
    });
  }, []);

  const latestUnread = useMemo(
    () => notifications.find((item) => !item.read && item.id !== dismissedId) || null,
    [notifications, dismissedId],
  );

  return (
    <View style={styles.root}>
      <AppNavigator />
      <View style={styles.bannerWrap} pointerEvents="box-none">
        <InAppBanner
          notification={latestUnread}
          onDismiss={() => setDismissedId(latestUnread?.id || null)}
          onPress={() => {
            if (!latestUnread) return;
            markRead(latestUnread.id);
            setDismissedId(null);
            if (latestUnread.route?.screen) {
              navigate(latestUnread.route.screen, latestUnread.route.params);
            }
          }}
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationCenterProvider>
            <Shell />
          </NotificationCenterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  bannerWrap: {
    position: 'absolute',
    top: spacing(1.5),
    left: spacing(1.5),
    right: spacing(1.5),
    zIndex: 200,
  },
});
