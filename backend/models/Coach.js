import mongoose from 'mongoose';

const coachingHistorySchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  position: { type: String, required: true }, // Head Coach, Assistant Coach, Bowling Coach, etc.
  yearsCoached: { type: String, required: true },
  achievements: { type: String },
  description: { type: String },
  playersCoached: { type: Number, default: 0 }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuingBody: { type: String, required: true }, // BCCI, NIS, etc.
  level: { type: String, required: true }, // Level 1, Level 2, Level 3, etc.
  yearObtained: { type: Number, required: true },
  expiryDate: { type: Date },
  certificateNumber: { type: String }
}, { _id: false });

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'certificate', 'reference', 'portfolio', 'photo'
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

// New schema for training programs
const trainingProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "6 weeks", "3 months"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  skillFocus: [{ 
    type: String,
    enum: ['batting', 'bowling', 'fielding', 'wicket-keeping', 'fitness', 'mental-coaching', 'strategy']
  }],
  difficultyLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    required: true 
  },
  maxParticipants: { type: Number, required: true },
  currentParticipants: { type: Number, default: 0 },
  sessions: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // Format: "HH:MM"
    endTime: { type: String, required: true },   // Format: "HH:MM"
    location: { type: String, required: true },
    focusArea: { type: String, required: true },
    notes: { type: String },
    attendance: [{
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
      attended: { type: Boolean, default: false },
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

// New schema for player progress tracking
const playerProgressSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach.trainingPrograms', required: true },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  attendanceRate: { type: Number, default: 0, min: 0, max: 100 },
  sessionsCompleted: { type: Number, default: 0 },
  totalSessions: { type: Number, default: 0 },
  skills: [{
    name: { type: String, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    notes: { type: String }
  }],
  recentSessions: [{
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach.trainingPrograms.sessions' },
    date: { type: Date, required: true },
    attended: { type: Boolean, default: false },
    focusArea: { type: String },
    notes: { type: String }
  }],
  lastUpdated: { type: Date, default: Date.now }
}, { _id: true });

// Schema for player goals set by coach
const playerGoalSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  title: { type: String, required: true },
  description: { type: String },
  targetType: { 
    type: String, 
    enum: ['skill', 'attendance', 'sessions', 'performance'], 
    required: true 
  },
  targetValue: { type: Number, required: true },
  currentValue: { type: Number, default: 0 },
  deadline: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'achieved', 'missed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: true });

// Schema for feedback given to players
const playerFeedbackSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach.trainingPrograms.sessions' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['performance', 'behavior', 'technique', 'attendance', 'general'], 
    default: 'general' 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const coachSchema = new mongoose.Schema({
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
  
  // Cricket Coaching Information
  coachingExperience: { 
    type: String, 
    enum: ['beginner', '1-2 years', '3-5 years', '5-10 years', '10+ years'], 
    required: true 
  },
  specializations: [{
    type: String,
    enum: ['batting', 'bowling', 'fielding', 'wicket-keeping', 'fitness', 'mental-coaching', 'strategy', 'youth-development']
  }],
  coachingPhilosophy: { type: String, maxlength: 1000 },
  methodology: { type: String, maxlength: 1000 },
  
  // Certifications
  certifications: [certificationSchema],
  
  // Coaching History
  coachingHistory: [coachingHistorySchema],
  
  // Documents
  documents: [documentSchema],
  
  // Training Programs
  trainingPrograms: [trainingProgramSchema],
  
  // Player Progress Tracking
  playerProgress: [playerProgressSchema],
  
  // Player Goals
  playerGoals: [playerGoalSchema],
  
  // Player Feedback
  playerFeedback: [playerFeedbackSchema],
  
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
  
  // Coaching Statistics
  statistics: {
    totalPlayersCoached: { type: Number, default: 0 },
    yearsOfExperience: { type: Number, default: 0 },
    tournamentsWon: { type: Number, default: 0 },
    playersDeveloped: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes for better query performance
coachSchema.index({ currentClub: 1 });
coachSchema.index({ 'applications.club': 1, 'applications.status': 1 });
coachSchema.index({ 'address.district': 1, isActive: 1 });
coachSchema.index({ age: 1, coachingExperience: 1 });
coachSchema.index({ specializations: 1 });

// Virtual for current pending application
coachSchema.virtual('currentApplication').get(function() {
  return this.applications.find(app => app.status === 'pending');
});

// Method to check if coach can apply to a club
coachSchema.methods.canApplyToClub = function(clubId) {
  // Check if coach already has a pending application
  const pendingApp = this.applications.find(app => app.status === 'pending');
  if (pendingApp) return false;
  
  // Check if coach is already associated with a club
  if (this.currentClub) return false;
  
  // Check if coach has already applied to this specific club recently
  const recentApp = this.applications.find(app => 
    app.club.toString() === clubId.toString() && 
    app.status === 'rejected' &&
    Date.now() - app.processedAt < 30 * 24 * 60 * 60 * 1000 // 30 days
  );
  if (recentApp) return false;
  
  return true;
};

// Method to add application
coachSchema.methods.addApplication = function(clubId) {
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

// Method to create a training program
coachSchema.methods.createTrainingProgram = function(programData) {
  this.trainingPrograms.push(programData);
  return this.save();
};

// Method to update a training program
coachSchema.methods.updateTrainingProgram = function(programId, updateData) {
  const program = this.trainingPrograms.id(programId);
  if (!program) {
    throw new Error('Training program not found');
  }
  
  Object.assign(program, updateData);
  return this.save();
};

// Method to delete a training program
coachSchema.methods.deleteTrainingProgram = function(programId) {
  const programIndex = this.trainingPrograms.findIndex(p => p._id.toString() === programId);
  if (programIndex === -1) {
    throw new Error('Training program not found');
  }
  
  this.trainingPrograms.splice(programIndex, 1);
  return this.save();
};

// Method to add player progress tracking
coachSchema.methods.addPlayerProgress = function(progressData) {
  this.playerProgress.push(progressData);
  return this.save();
};

// Method to update player progress
coachSchema.methods.updatePlayerProgress = function(progressId, updateData) {
  const progress = this.playerProgress.id(progressId);
  if (!progress) {
    throw new Error('Player progress record not found');
  }
  
  Object.assign(progress, updateData);
  return this.save();
};

// Method to get player progress for a specific program
coachSchema.methods.getPlayerProgressForProgram = function(programId) {
  return this.playerProgress.filter(progress => 
    progress.program.toString() === programId.toString()
  );
};

// Add a method to get all sessions for the coach
coachSchema.methods.getAllSessions = function() {
  const allSessions = [];
  this.trainingPrograms.forEach(program => {
    program.sessions.forEach(session => {
      allSessions.push({
        _id: session._id,
        focusArea: session.focusArea,
        location: session.location,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        notes: session.notes,
        programId: program._id,
        programTitle: program.title
      });
    });
  });
  return allSessions;
};

// Method to resign from current club
coachSchema.methods.resignFromClub = function(resignReason = '') {
  if (!this.currentClub) {
    throw new Error('Not currently associated with any club');
  }
  
  // Store resign reason in a new field
  const resignRecord = {
    club: this.currentClub,
    resignedAt: new Date(),
    reason: resignReason
  };
  
  // Add to a resign history array (if it doesn't exist, create it)
  if (!this.resignHistory) {
    this.resignHistory = [];
  }
  this.resignHistory.push(resignRecord);
  
  // Remove the club association
  const previousClub = this.currentClub;
  this.currentClub = null;
  this.joinedClubAt = null;
  
  // Remove any pending applications to this club
  this.applications = this.applications.filter(app => 
    !(app.club.toString() === previousClub.toString() && app.status === 'pending')
  );
  
  return this.save();
};

// Add resignHistory field to the schema
coachSchema.add({
  resignHistory: [{
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    resignedAt: { type: Date },
    reason: { type: String }
  }]
});

export default mongoose.model('Coach', coachSchema);