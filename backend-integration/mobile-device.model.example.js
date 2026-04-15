import mongoose from 'mongoose';

const MobileDeviceSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fcm_token: { type: String, required: true, index: true },
    platform: { type: String, enum: ['android', 'ios'], default: 'android' },
    device_name: { type: String },
    notification_sound: { type: Boolean, default: true },
    last_seen_at: { type: Date },
  },
  { timestamps: true }
);

MobileDeviceSchema.index({ user_id: 1, fcm_token: 1 }, { unique: true });

export default mongoose.model('MobileDevice', MobileDeviceSchema);
