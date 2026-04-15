export type LoginResponse = {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message?: string;
};

export type CurrentUser = LoginResponse['user'];

export type Contact = {
  id?: string;
  _id?: string;
  name?: string;
  phone_number?: string;
  email?: string;
  avatar?: string | null;
  chat_status?: string;
};

export type RecentChatItem = {
  contact: {
    id: string;
    number?: string;
    name?: string;
    avatar?: string | null;
    chat_status?: string;
  };
  lastMessage: {
    id: string;
    content?: string;
    messageType?: string;
    createdAt?: string;
    unreadCount?: number | string;
  };
};

export type ChatMessage = {
  id: string;
  content: string | null;
  createdAt: string;
  direction: 'inbound' | 'outbound';
  messageType?: string;
  fileUrl?: string | null;
  sender?: { id?: string; name?: string };
  recipient?: { id?: string; name?: string };
};

export type PhoneNumberRecord = {
  id: string;
  display_phone_number: string;
  is_primary?: boolean;
};

export type ConnectionRecord = {
  id: string;
  name?: string;
  is_active?: boolean;
  phone_numbers?: Array<{
    id: string;
    display_phone_number: string;
    is_primary?: boolean;
    verified_name?: string;
    quality_rating?: string;
  }>;
};

export type CampaignRecord = {
  _id?: string;
  id?: string;
  name?: string;
  status?: string;
  created_at?: string;
  scheduled_at?: string;
};

export type CrmRecord = {
  _id?: string;
  id?: string;
  number?: string;
  customer_name?: string;
  status?: string;
  total?: number;
  created_at?: string;
};

export type SubscriptionRecord = {
  _id?: string;
  status?: string;
  current_period_end?: string;
  payment_gateway?: string;
  amount_paid?: number;
  currency?: string;
  auto_renew?: boolean;
  usage?: Record<string, number>;
  plan_id?: {
    _id?: string;
    name?: string;
    billing_cycle?: string;
    price?: number;
    currency?: { code?: string; symbol?: string } | string;
    features?: Record<string, number>;
    description?: string;
    android_product_id?: string;
    android_offer_token?: string;
  } | string;
};

export type PlanRecord = {
  _id: string;
  name: string;
  price: number;
  billing_cycle: string;
  description?: string;
  currency?: { code?: string; symbol?: string } | string;
  android_product_id?: string;
  android_offer_token?: string;
  features?: Record<string, number>;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  type: 'chat' | 'campaign' | 'billing' | 'system';
  createdAt: string;
  read: boolean;
  route?: {
    screen: string;
    params?: Record<string, string>;
  };
  raw?: Record<string, string>;
};
