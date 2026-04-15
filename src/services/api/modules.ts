import type {
  CampaignRecord,
  ChatMessage,
  ConnectionRecord,
  Contact,
  LoginResponse,
  PhoneNumberRecord,
  PlanRecord,
  RecentChatItem,
  SubscriptionRecord,
} from '@/types';
import { apiRequest } from '@/services/api/client';

export async function login(identifier: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: { identifier, password, agenda: 'login' },
  });
}

export async function getProfile(): Promise<any> {
  return apiRequest<any>({ url: '/auth/profile', method: 'GET' });
}

export async function getDashboard(): Promise<any> {
  return apiRequest<any>({ url: '/dashboard', method: 'GET' });
}

export async function getRecentChats(params?: Record<string, string>): Promise<{ data: RecentChatItem[] }> {
  return apiRequest<{ data: RecentChatItem[] }>({ url: '/whatsapp/chats', method: 'GET', params });
}

export async function getMessages(contactId: string, whatsappPhoneNumberId?: string): Promise<{ messages: any[] }> {
  const params: Record<string, string> = { contact_id: contactId };
  if (whatsappPhoneNumberId) {
    params.whatsapp_phone_number_id = whatsappPhoneNumberId;
  }
  return apiRequest<{ messages: any[] }>({ url: '/whatsapp/messages', method: 'GET', params });
}

export async function sendTextMessage(payload: {
  contact_id: string;
  whatsapp_phone_number_id: string;
  message: string;
  provider?: string;
}): Promise<any> {
  return apiRequest<any>({
    url: '/whatsapp/send',
    method: 'POST',
    data: {
      ...payload,
      type: 'text',
      messageType: 'text',
    },
  });
}

export async function getContacts(params?: Record<string, string | number>): Promise<any> {
  return apiRequest<any>({ url: '/contacts', method: 'GET', params });
}

export async function createContact(payload: Partial<Contact>): Promise<any> {
  return apiRequest<any>({ url: '/contacts', method: 'POST', data: payload });
}

export async function updateContact(id: string, payload: Partial<Contact>): Promise<any> {
  return apiRequest<any>({ url: `/contacts/${id}`, method: 'PUT', data: payload });
}

export async function getCampaigns(params?: Record<string, string | number>): Promise<any> {
  return apiRequest<any>({ url: '/campaigns', method: 'GET', params });
}

export async function createCampaign(payload: Record<string, unknown>): Promise<any> {
  return apiRequest<any>({ url: '/campaigns', method: 'POST', data: payload });
}

export async function sendCampaign(id: string): Promise<any> {
  return apiRequest<any>({ url: `/campaigns/${id}/send`, method: 'POST' });
}

export async function getLiteCrmSummary(): Promise<any> {
  return apiRequest<any>({ url: '/lite-crm/summary', method: 'GET' });
}

export async function getInvoices(params?: Record<string, string | number>): Promise<any> {
  return apiRequest<any>({ url: '/lite-crm/invoices', method: 'GET', params });
}

export async function getQuotations(params?: Record<string, string | number>): Promise<any> {
  return apiRequest<any>({ url: '/lite-crm/quotations', method: 'GET', params });
}

export async function getSales(params?: Record<string, string | number>): Promise<any> {
  return apiRequest<any>({ url: '/lite-crm/sales', method: 'GET', params });
}

export async function sendInvoiceOnWhatsapp(id: string, whatsappPhoneNumberId?: string): Promise<any> {
  return apiRequest<any>({
    url: `/lite-crm/invoices/${id}/send-whatsapp`,
    method: 'POST',
    data: whatsappPhoneNumberId ? { whatsapp_phone_number_id: whatsappPhoneNumberId } : {},
  });
}

export async function sendQuotationOnWhatsapp(id: string, whatsappPhoneNumberId?: string): Promise<any> {
  return apiRequest<any>({
    url: `/lite-crm/quotations/${id}/send-whatsapp`,
    method: 'POST',
    data: whatsappPhoneNumberId ? { whatsapp_phone_number_id: whatsappPhoneNumberId } : {},
  });
}

export async function getConnections(): Promise<{ data: ConnectionRecord[] }> {
  return apiRequest<{ data: ConnectionRecord[] }>({ url: '/whatsapp/connections', method: 'GET' });
}

export async function getMyPhoneNumbers(): Promise<{ data: PhoneNumberRecord[] }> {
  return apiRequest<{ data: PhoneNumberRecord[] }>({ url: '/whatsapp/phone-numbers', method: 'GET' });
}

export async function setPrimaryPhoneNumber(phoneNumberId: string): Promise<any> {
  return apiRequest<any>({
    url: `/whatsapp/phone-numbers/${phoneNumberId}/set-primary`,
    method: 'PUT',
  });
}

export async function getSubscription(): Promise<{ data: SubscriptionRecord }> {
  return apiRequest<{ data: SubscriptionRecord }>({ url: '/subscription/my-subscription', method: 'GET' });
}

export async function getPlans(): Promise<any> {
  return apiRequest<any>({ url: '/plan/active', method: 'GET' });
}

export async function registerDeviceToken(payload: {
  fcm_token: string;
  platform: 'android';
  device_name?: string;
  notification_sound?: boolean;
}): Promise<any> {
  return apiRequest<any>({
    url: '/mobile/devices/register',
    method: 'POST',
    data: payload,
  });
}

export async function unregisterDeviceToken(payload: { fcm_token: string }): Promise<any> {
  return apiRequest<any>({
    url: '/mobile/devices/unregister',
    method: 'POST',
    data: payload,
  });
}

export async function verifyGooglePlayPurchase(payload: {
  plan_id: string;
  product_id: string;
  purchase_token: string;
  order_id?: string;
  package_name?: string;
}): Promise<any> {
  return apiRequest<any>({
    url: '/mobile/subscription/google/verify',
    method: 'POST',
    data: payload,
  });
}
