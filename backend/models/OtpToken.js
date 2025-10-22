import mongoose from 'mongoose';

const otpTokenSchema = new mongoose.Schema({
  email: { type: String, index: true },
  codeHash: String,
  expiresAt: Date,
  consumed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('OtpToken', otpTokenSchema);