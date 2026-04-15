export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function extractArray<T = any>(payload: any, fallbacks: string[] = []): T[] {
  if (Array.isArray(payload)) return payload as T[];
  for (const key of fallbacks) {
    const value = payload?.[key];
    if (Array.isArray(value)) return value as T[];
    if (Array.isArray(value?.items)) return value.items as T[];
    if (Array.isArray(value?.plans)) return value.plans as T[];
    if (Array.isArray(value?.widgets)) return value.widgets as T[];
  }
  if (Array.isArray(payload?.data)) return payload.data as T[];
  if (Array.isArray(payload?.data?.items)) return payload.data.items as T[];
  return [];
}

export function formatCurrency(value?: number, currency?: string | { code?: string; symbol?: string }): string {
  if (typeof value !== 'number') return '--';
  const symbol = typeof currency === 'string' ? currency : currency?.symbol || currency?.code || '₹';
  return `${symbol} ${value.toFixed(2)}`;
}

export function formatDate(input?: string): string {
  if (!input) return '--';
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleString();
}

export function makeId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function stripApi(url: string): string {
  return url.replace(/\/api\/?$/, '').replace(/\/$/, '');
}
