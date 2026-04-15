import axios, { type AxiosRequestConfig } from 'axios';
import { getRuntimeConfig } from '@/config/runtime';
import { getSession } from '@/services/storage';

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const runtime = await getRuntimeConfig();
  const session = await getSession();

  const client = axios.create({
    baseURL: runtime.apiBaseUrl,
    timeout: 30000,
  });

  const headers: Record<string, string> = {
    ...(config.headers as Record<string, string> | undefined),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const response = await client.request<T>({
    ...config,
    headers,
  });

  return response.data;
}
