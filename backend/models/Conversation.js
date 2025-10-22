import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  name: { 
    type: String,
    maxlength: 100 
  },
  type: {
    type: String,
    enum: ['group', 'direct'],
    required: true
  },
  club: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Club',
    required: true,
    index: true
  },
  reason: {
    type: String,
    maxlength: 200
  },
  participants: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['coach', 'player', 'clubManager'],
      required: true
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    },
    leftAt: Date,
    isActive: { 
      type: Boolean, 
      default: true 
    },
    lastSeenAt: Date,
    unreadCount: { 
      type: Number, 
      default: 0 
    }
  }],
  lastMessage: {
    content: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: Date
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  metadata: {
    totalMessages: { type: Number, default: 0 },
    lastActivity: Date
  }
}, { timestamps: true });

// Indexes for better query performance
conversationSchema.index({ club: 1, type: 1 });
conversationSchema.index({ 'participants.user': 1, isActive: 1 });
conversationSchema.index({ 'lastMessage.timestamp': -1 });
conversationSchema.index({ type: 1, 'participants.user': 1 });

// Virtual to get active participants
conversationSchema.virtual('activeParticipants').get(function() {
  return this.participants.filter(p => p.isActive);
});

// Method to check if a user is a participant
conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => 
    p.user.toString() === userId.toString() && p.isActive
  );
};

// Method to add a participant
conversationSchema.methods.addParticipant = function(userId, role) {
  const existingParticipant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (existingParticipant) {
    if (!existingParticipant.isActive) {
      existingParticipant.isActive = true;
      existingParticipant.joinedAt = new Date();
      existingParticipant.leftAt = null;
    }
  } else {
    this.participants.push({
      user: userId,
      role: role,
      joinedAt: new Date(),
      isActive: true
    });
  }
  
  return this.save();
};

// Method to remove a participant
conversationSchema.methods.removeParticipant = function(userId) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.isActive = false;
    participant.leftAt = new Date();
  }
  
  return this.save();
};

// Method to update last message
conversationSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt || new Date()
  };
  this.metadata.totalMessages = (this.metadata.totalMessages || 0) + 1;
  this.metadata.lastActivity = new Date();
  
  return this.save();
};

// Method to update participant's last seen
conversationSchema.methods.updateLastSeen = function(userId) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.lastSeenAt = new Date();
    participant.unreadCount = 0;
  }
  
  return this.save();
};

// Method to increment unread count for all participants except sender
conversationSchema.methods.incrementUnreadCounts = function(senderId) {
  this.participants.forEach(p => {
    if (p.user.toString() !== senderId.toString() && p.isActive) {
      p.unreadCount = (p.unreadCount || 0) + 1;
    }
  });
  
  return this.save();
};

// Static method to find or create a direct conversation
conversationSchema.statics.findOrCreateDirect = async function(user1Id, user2Id, clubId) {
  // Look for existing direct conversation between these two users in this club
  let conversation = await this.findOne({
    type: 'direct',
    club: clubId,
    'participants.user': { $all: [user1Id, user2Id] }
  });
  
  if (!conversation) {
    // Get user details to determine roles
    const User = mongoose.model('User');
    const [user1, user2] = await Promise.all([
      User.findById(user1Id),
      User.findById(user2Id)
    ]);
    
    conversation = new this({
      type: 'direct',
      club: clubId,
      participants: [
        { user: user1Id, role: user1.role },
        { user: user2Id, role: user2.role }
      ],
      createdBy: user1Id,
      isActive: true
    });
    
    await conversation.save();
  }
  
  return conversation;
};

export default mongoose.model('Conversation', conversationSchema);
