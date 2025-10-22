import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  orderId: { type: String, index: true },
  paymentId: { type: String, index: true },
  signature: { type: String },

  amount: { type: Number, required: true }, // in paise
  currency: { type: String, default: 'INR' },
  receipt: { type: String },

  status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created', index: true },
  verification: {
    verified: { type: Boolean, default: false },
    method: { type: String, enum: ['signature', 'webhook', 'manual'], default: 'signature' },
    verifiedAt: { type: Date }
  },

  notes: { type: Object },
}, { timestamps: true });

paymentSchema.index({ tournament: 1, club: 1, status: 1 });

export default mongoose.model('Payment', paymentSchema);