// Example only. Wire this to Google Play Developer API verification on your secure backend.
import Subscription from '../models/subscription.model.js';
import Plan from '../models/plan.model.js';

export async function verifyGooglePlaySubscription(req, res) {
  const { plan_id, product_id, purchase_token, order_id, package_name } = req.body;

  if (!plan_id || !product_id || !purchase_token) {
    return res.status(400).json({
      success: false,
      message: 'plan_id, product_id, and purchase_token are required',
    });
  }

  const plan = await Plan.findById(plan_id);
  if (!plan) {
    return res.status(404).json({ success: false, message: 'Plan not found' });
  }

  // TODO:
  // 1. Verify purchase_token against Google Play Developer API
  // 2. Read expiryTime / acknowledgement / linkedPurchaseToken
  // 3. Upsert active subscription for req.user.id
  // 4. Store raw purchase receipt for audit

  const subscription = await Subscription.findOneAndUpdate(
    { user_id: req.user.id },
    {
      user_id: req.user.id,
      plan_id,
      status: 'active',
      payment_gateway: 'google_play',
      payment_method: 'google_play',
      payment_status: 'paid',
      transaction_id: order_id || purchase_token,
      meta: {
        product_id,
        purchase_token,
        package_name,
      },
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      auto_renew: true,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return res.json({
    success: true,
    message: 'Google Play subscription verified',
    data: subscription,
  });
}
