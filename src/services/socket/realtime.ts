import { io, type Socket } from 'socket.io-client';
import { getRuntimeConfig } from '@/config/runtime';
import { getSession } from '@/services/storage';
import { stripApi } from '@/utils/helpers';

let socket: Socket | null = null;

export async function connectRealtime(): Promise<Socket> {
  if (socket?.connected) return socket;

  const runtime = await getRuntimeConfig();
  const session = await getSession();

  socket = io(stripApi(runtime.socketBaseUrl || runtime.apiBaseUrl), {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    auth: {
      token: session?.token,
    },
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function getRealtimeSocket(): Socket | null {
  return socket;
}

export function disconnectRealtime(): void {
  socket?.disconnect();
  socket = null;
}
