import mongoose from 'mongoose';

const careerHistorySchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  position: { type: String, required: true },
  yearsPlayed: { type: String, required: true },
  achievements: { type: String },
  description: { type: String }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'certificate', 'scorecard', 'photo', 'reference'
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
}, { _id: true });

const applicationSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  approvalNotes: { type: String }
}, { _id: true });

const playerSchema = new mongoose.Schema({
  // User reference
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // Backward-compat: store Firebase UID to satisfy existing unique index userUid_1
  userUid: { type: String, index: true },
  
  // Basic Information
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  phone: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Indian phone number validation
        return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
      },
      message: 'Please enter a valid Indian phone number'
    }
  },
  email: { type: String, required: true },
  
  // Address Information
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { 
      type: String, 
      required: true,
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: 'Please enter a valid 6-digit pincode'
      }
    }
  },
  
  // Cricket Information
  battingStyle: { 
    type: String, 
    enum: ['right-handed', 'left-handed'], 
    required: true 
  },
  bowlingStyle: { 
    type: String, 
    enum: ['right-arm-fast', 'left-arm-fast', 'right-arm-medium', 'left-arm-medium', 
           'right-arm-spin', 'left-arm-spin', 'wicket-keeper', 'none'], 
    required: true 
  },
  preferredPosition: { 
    type: String, 
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'fielder'], 
    required: true 
  },
  // Preferred jersey number (optional)
  jerseyNumber: { type: Number, min: 0, max: 99 },
  playingExperience: { 
    type: String, 
    enum: ['beginner', '1-2 years', '3-5 years', '5-10 years', '10+ years'], 
    required: true 
  },
  
  // Career History
  careerHistory: [careerHistorySchema],
  
  // Documents
  documents: [documentSchema],
  
  // Profile Photo
  profilePhoto: {
    data: Buffer,
    contentType: String
  },
  
  // Current Club Association
  currentClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  joinedClubAt: { type: Date },
  
  // Application History
  applications: [applicationSchema],
  
  // Status
  isActive: { type: Boolean, default: true },
  profileCompleted: { type: Boolean, default: false },
  
  // Statistics (for future use)
  statistics: {
    matchesPlayed: { type: Number, default: 0 },
    runsScored: { type: Number, default: 0 },
    wicketsTaken: { type: Number, default: 0 },
    catches: { type: Number, default: 0 },
    stumpings: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes for better query performance
// Note: user field already has unique index from schema definition
playerSchema.index({ currentClub: 1 });
playerSchema.index({ 'applications.club': 1, 'applications.status': 1 });
playerSchema.index({ 'address.district': 1, isActive: 1 });
playerSchema.index({ age: 1, preferredPosition: 1 });

// Virtual for current pending application
playerSchema.virtual('currentApplication').get(function() {
  return this.applications.find(app => app.status === 'pending');
});

// Method to check if player can apply to a club
playerSchema.methods.canApplyToClub = function(clubId) {
  // Check if player already has a pending application
  const pendingApp = this.applications.find(app => app.status === 'pending');
  if (pendingApp) return false;
  
  // Check if player is already a member of a club
  if (this.currentClub) return false;
  
  // Check if player has already applied to this specific club recently
  const recentApp = this.applications.find(app => 
    app.club.toString() === clubId.toString() && 
    app.status === 'rejected' &&
    Date.now() - app.processedAt < 30 * 24 * 60 * 60 * 1000 // 30 days
  );
  if (recentApp) return false;
  
  return true;
};

// Method to add application
playerSchema.methods.addApplication = function(clubId) {
  if (!this.canApplyToClub(clubId)) {
    throw new Error('Cannot apply to this club at this time');
  }
  
  this.applications.push({
    club: clubId,
    status: 'pending',
    appliedAt: new Date()
  });
  
  return this.save();
};

export default mongoose.model('Player', playerSchema);