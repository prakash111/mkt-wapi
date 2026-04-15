import {
  endConnection,
  finishTransaction,
  getAvailablePurchases,
  getSubscriptions,
  initConnection,
  requestSubscription,
} from 'react-native-iap';
import type { PlanRecord } from '@/types';
import { verifyGooglePlayPurchase } from '@/services/api/modules';

export async function startIapConnection(): Promise<void> {
  await initConnection();
}

export async function stopIapConnection(): Promise<void> {
  await endConnection();
}

export async function loadSubscriptionProducts(plans: PlanRecord[]): Promise<any[]> {
  const skus = plans.map((plan) => plan.android_product_id).filter(Boolean) as string[];
  if (skus.length === 0) return [];
  return getSubscriptions({ skus });
}

export async function buyPlan(plan: PlanRecord): Promise<void> {
  if (!plan.android_product_id) {
    throw new Error('This plan does not have an Android product id configured');
  }

  await requestSubscription({
    sku: plan.android_product_id,
    ...(plan.android_offer_token ? { subscriptionOffers: [{ sku: plan.android_product_id, offerToken: plan.android_offer_token }] } : {}),
  });
}

export async function syncExistingPurchases(planMap: Record<string, PlanRecord>): Promise<void> {
  const purchases = await getAvailablePurchases();
  for (const purchase of purchases) {
    const productId = purchase.productId;
    const plan = planMap[productId];
    if (!plan || !purchase.purchaseToken) continue;

    await verifyGooglePlayPurchase({
      plan_id: plan._id,
      product_id: productId,
      purchase_token: purchase.purchaseToken,
      order_id: purchase.transactionId,
    });

    await finishTransaction({
      purchase,
      isConsumable: false,
    });
  }
}
