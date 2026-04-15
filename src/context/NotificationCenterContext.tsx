import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppNotification } from '@/types';

const KEY = 'notification-center:v1';

type NotificationContextValue = {
  notifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  removeNotification: (id: string) => void;
};

const NotificationCenterContext = createContext<NotificationContextValue | null>(null);

export function NotificationCenterProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return;
      try {
        setNotifications(JSON.parse(raw) as AppNotification[]);
      } catch {
        setNotifications([]);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(notifications)).catch(() => null);
  }, [notifications]);

  const addNotification = useCallback((notification: AppNotification) => {
    setNotifications((current) => [notification, ...current].slice(0, 200));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, markRead, markAllRead, removeNotification }),
    [notifications, addNotification, markRead, markAllRead, removeNotification],
  );

  return <NotificationCenterContext.Provider value={value}>{children}</NotificationCenterContext.Provider>;
}

export function useNotificationCenter(): NotificationContextValue {
  const value = useContext(NotificationCenterContext);
  if (!value) throw new Error('useNotificationCenter must be used within NotificationCenterProvider');
  return value;
}
