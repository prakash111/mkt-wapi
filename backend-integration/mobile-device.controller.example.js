import MobileDevice from '../models/mobile-device.model.js';

export async function registerMobileDevice(req, res) {
  const { fcm_token, platform, device_name, notification_sound = true } = req.body;

  if (!fcm_token) {
    return res.status(400).json({ success: false, message: 'fcm_token is required' });
  }

  const device = await MobileDevice.findOneAndUpdate(
    { user_id: req.user.id, fcm_token },
    {
      user_id: req.user.id,
      fcm_token,
      platform: platform || 'android',
      device_name,
      notification_sound,
      last_seen_at: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return res.json({ success: true, data: device });
}

export async function unregisterMobileDevice(req, res) {
  const { fcm_token } = req.body;
  await MobileDevice.deleteOne({ user_id: req.user.id, fcm_token });
  return res.json({ success: true });
}
