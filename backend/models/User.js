import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  district: { type: String },
  role: { type: String, enum: ['admin', 'clubManager', 'player', 'coach', 'public'], default: 'public' },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  // Per-account favorites
  favoriteTournaments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', default: [] }],
  favoriteClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club', default: [] }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);