import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  // Legacy fields (keeping for backward compatibility)
  name: { type: String }, // Made optional for backward compatibility
  logoUrl: String, // Will hold a stable route like /api/clubs/:id/logo
  
  // Stored logo binary in MongoDB
  logo: {
    data: Buffer,
    contentType: String
  },
  
  // Stored proof document binary in MongoDB
  proof: {
    data: Buffer,
    contentType: String
  },
  
  // New registration fields
  clubName: { type: String }, // Primary club name field
  district: { type: String, required: true },
  city: { type: String },
  foundedYear: { 
    type: Number, 
    min: [1850, 'Founded year cannot be before 1850'], 
    max: [new Date().getFullYear(), 'Founded year cannot be in the future'],
    validate: {
      validator: function(v) {
        return !v || (v >= 1850 && v <= new Date().getFullYear());
      },
      message: 'Founded year must be between 1850 and current year'
    }
  },
  
  // Contact information
  managerName: { type: String },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        // Indian phone number validation: +91 followed by 10 digits or just 10 digits
        return /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
      },
      message: 'Please enter a valid Indian phone number'
    }
  },
  email: { type: String },
  
  // Club details
  description: { type: String },
  groundName: { type: String },
  memberCount: { type: Number, min: 1 },
  website: { type: String },
  achievements: { type: String },
  
  // Status and processing
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionReason: { type: String },
  
  // Relationships
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Players (for future use)
  players: [{
    name: String,
    role: String,
    age: Number
  }]
}, { timestamps: true });

// Indexes for better query performance
clubSchema.index({ status: 1, submittedAt: -1 });
clubSchema.index({ manager: 1 });
clubSchema.index({ district: 1, status: 1 });

export default mongoose.model('Club', clubSchema);