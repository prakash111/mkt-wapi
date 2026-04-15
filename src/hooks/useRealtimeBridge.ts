import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { connectRealtime, disconnectRealtime } from '@/services/socket/realtime';
import { useNotificationCenter } from '@/context/NotificationCenterContext';
import { makeId } from '@/utils/helpers';

export function useRealtimeBridge(enabled: boolean) {
  const queryClient = useQueryClient();
  const { addNotification } = useNotificationCenter();

  useEffect(() => {
    if (!enabled) return;

    let unmounted = false;

    connectRealtime()
      .then((socket) => {
        if (unmounted) return;

        const onNewMessage = (payload: any) => {
          queryClient.invalidateQueries({ queryKey: ['recentChats'] });
          if (payload?.contact_id) {
            queryClient.invalidateQueries({
              queryKey: ['messages', payload.contact_id, payload.whatsapp_phone_number_id || ''],
            });
          }

          addNotification({
            id: makeId('chat'),
            title: payload?.sender?.name || payload?.contact_name || 'New message',
            body: payload?.content || 'You received a new message',
            type: 'chat',
            createdAt: new Date().toISOString(),
            read: false,
            route: payload?.contact_id
              ? {
                  screen: 'ChatThread',
                  params: {
                    contactId: payload.contact_id,
                    contactName: payload?.sender?.name || payload?.contact_name || '',
                    whatsappPhoneNumberId: payload?.whatsapp_phone_number_id || '',
                  },
                }
              : undefined,
          });
        };

        const onMessageStatus = () => {
          queryClient.invalidateQueries({ queryKey: ['recentChats'] });
        };

        const onConnectionUpdate = () => {
          queryClient.invalidateQueries({ queryKey: ['connections'] });
          queryClient.invalidateQueries({ queryKey: ['phoneNumbers'] });
        };

        socket.on('new-message', onNewMessage);
        socket.on('message-status-updated', onMessageStatus);
        socket.on('whatsapp:connection:update', onConnectionUpdate);

        return () => {
          socket.off('new-message', onNewMessage);
          socket.off('message-status-updated', onMessageStatus);
          socket.off('whatsapp:connection:update', onConnectionUpdate);
        };
      })
      .catch(() => null);

    return () => {
      unmounted = true;
      disconnectRealtime();
    };
  }, [enabled, queryClient, addNotification]);
}
