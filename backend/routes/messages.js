import express from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Club from '../models/Club.js';
import Coach from '../models/Coach.js';
import Player from '../models/Player.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = express.Router();

// Helper function to get user's club and role
async function getUserClubAndRole(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  let clubId = null;
  let userRole = user.role;
  
  if (user.role === 'clubManager') {
    const club = await Club.findOne({ manager: userId });
    if (club) clubId = club._id;
  } else if (user.role === 'coach') {
    const coach = await Coach.findOne({ user: userId });
    if (coach && coach.currentClub) clubId = coach.currentClub;
  } else if (user.role === 'player') {
    const player = await Player.findOne({ user: userId });
    if (player && player.currentClub) clubId = player.currentClub;
  }
  
  return { clubId, userRole };
}

// GET /api/messages/conversations - Get all conversations for the current user
router.get('/conversations', verifyFirebaseToken, async (req, res) => {
  try {
    const { clubId } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      return res.status(400).json({ message: 'User is not associated with any club' });
    }
    
    const conversations = await Conversation.find({
      club: clubId,
      'participants.user': req.user._id,
      'participants.isActive': true,
      isActive: true
    })
    .populate('participants.user', 'name email role')
    .populate('lastMessage.sender', 'name')
    .sort('-lastMessage.timestamp');
    
    console.log('Found conversations for user:', req.user._id, 'Count:', conversations.length);
    conversations.forEach(conv => {
      console.log('Conversation ID:', conv._id, 'Type:', conv.type, 'Name:', conv.name);
    });
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/conversations/:conversationId - Get a specific conversation (for debugging)
router.get('/conversations/:conversationId', verifyFirebaseToken, async (req, res) => {
  try {
    console.log('Getting conversation:', req.params.conversationId);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
      return res.status(400).json({ message: 'Invalid conversation ID format' });
    }
    
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants.user', 'name email role');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/club-members - Get all club members for starting conversations
router.get('/club-members', verifyFirebaseToken, async (req, res) => {
  try {
    const { clubId, userRole } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      return res.status(400).json({ message: 'User is not associated with any club' });
    }
    
    const members = [];
    
    // Get club manager
    const club = await Club.findById(clubId).populate('manager', 'name email role');
    if (club && club.manager && club.manager._id.toString() !== req.user._id.toString()) {
      members.push({
        _id: club.manager._id,
        name: club.manager.name,
        email: club.manager.email,
        role: 'clubManager',
        type: 'Club Manager'
      });
    }
    
    // Get coach
    const coach = await Coach.findOne({ currentClub: clubId })
      .populate('user', 'name email role');
    if (coach && coach.user && coach.user._id.toString() !== req.user._id.toString()) {
      members.push({
        _id: coach.user._id,
        name: coach.user.name || coach.fullName,
        email: coach.user.email,
        role: 'coach',
        type: 'Coach'
      });
    }
    
    // Get players
    const players = await Player.find({ currentClub: clubId })
      .populate('user', 'name email role');
    players.forEach(player => {
      if (player.user && player.user._id.toString() !== req.user._id.toString()) {
        members.push({
          _id: player.user._id,
          name: player.user.name || player.fullName,
          email: player.user.email,
          role: 'player',
          type: 'Player'
        });
      }
    });
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching club members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/conversations/group - Create a group conversation
router.post('/conversations/group', verifyFirebaseToken, async (req, res) => {
  try {
    const { name, reason } = req.body;
    const { clubId, userRole } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      return res.status(400).json({ message: 'User is not associated with any club' });
    }
    
    // Only coaches and club managers can create group chats
    if (userRole !== 'coach' && userRole !== 'clubManager') {
      return res.status(403).json({ message: 'Only coaches and club managers can create group chats' });
    }

    // Validate reason is provided
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ message: 'Reason for creating group chat is required' });
    }
    
    // Get all club members
    const participants = [];
    
    // Add creator
    participants.push({
      user: req.user._id,
      role: userRole,
      isActive: true
    });
    
    // Add club manager
    const club = await Club.findById(clubId);
    if (club && club.manager && club.manager.toString() !== req.user._id.toString()) {
      participants.push({
        user: club.manager,
        role: 'clubManager',
        isActive: true
      });
    }
    
    // Add coach
    const coach = await Coach.findOne({ currentClub: clubId });
    if (coach && coach.user && coach.user.toString() !== req.user._id.toString()) {
      participants.push({
        user: coach.user,
        role: 'coach',
        isActive: true
      });
    }
    
    // Add all players
    const players = await Player.find({ currentClub: clubId });
    players.forEach(player => {
      if (player.user && player.user.toString() !== req.user._id.toString()) {
        participants.push({
          user: player.user,
          role: 'player',
          isActive: true
        });
      }
    });
    
    const conversation = new Conversation({
      name: name || `${club.clubName || club.name} Group Chat`,
      type: 'group',
      club: clubId,
      participants,
      createdBy: req.user._id,
      reason: reason.trim(),
      isActive: true
    });
    
    await conversation.save();
    await conversation.populate('participants.user', 'name email role');
    
    res.json(conversation);
  } catch (error) {
    console.error('Error creating group conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/conversations/direct - Create or get a direct conversation
router.post('/conversations/direct', verifyFirebaseToken, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }
    
    const { clubId } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      return res.status(400).json({ message: 'User is not associated with any club' });
    }
    
    // Check if recipient is in the same club
    const recipientData = await getUserClubAndRole(recipientId);
    if (!recipientData.clubId || recipientData.clubId.toString() !== clubId.toString()) {
      return res.status(400).json({ message: 'Recipient is not in the same club' });
    }
    
    const conversation = await Conversation.findOrCreateDirect(
      req.user._id,
      recipientId,
      clubId
    );
    
    await conversation.populate('participants.user', 'name email role');
    
    res.json(conversation);
  } catch (error) {
    console.error('Error creating direct conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/conversations/:conversationId - Get a specific conversation
router.get('/conversations/:conversationId', verifyFirebaseToken, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId)
      .populate('participants.user', 'name email role');
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({ message: 'You are not a participant in this conversation' });
    }
    
    // Update last seen and reset unread count
    await conversation.updateLastSeen(req.user._id);
    
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/messages/conversations/:conversationId/messages - Get messages for a conversation
router.get('/conversations/:conversationId/messages', verifyFirebaseToken, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({ message: 'You are not a participant in this conversation' });
    }
    
    const messages = await Message.find({
      conversation: req.params.conversationId,
      isDeleted: false
    })
    .populate('sender', 'name email role')
    .sort('-createdAt')
    .limit(parseInt(limit))
    .skip(skip);
    
    // Mark messages as read
    const unreadMessages = messages.filter(msg => !msg.isReadByUser(req.user._id));
    await Promise.all(unreadMessages.map(msg => msg.markAsRead(req.user._id)));
    
    // Update conversation last seen
    await conversation.updateLastSeen(req.user._id);
    
    res.json({
      messages: messages.reverse(), // Return in chronological order
      page: parseInt(page),
      totalPages: Math.ceil(await Message.countDocuments({ 
        conversation: req.params.conversationId,
        isDeleted: false 
      }) / limit)
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/messages/conversations/:conversationId/messages - Send a message
router.post('/conversations/:conversationId/messages', verifyFirebaseToken, async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    const conversation = await Conversation.findById(req.params.conversationId);
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    // Check if user is a participant
    if (!conversation.isParticipant(req.user._id)) {
      return res.status(403).json({ message: 'You are not a participant in this conversation' });
    }
    
    const message = new Message({
      conversation: req.params.conversationId,
      sender: req.user._id,
      content: content.trim(),
      type,
      readBy: [{ user: req.user._id }] // Mark as read by sender
    });
    
    await message.save();
    await message.populate('sender', 'name email role');
    
    // Update conversation's last message and increment unread counts
    await conversation.updateLastMessage(message);
    await conversation.incrementUnreadCounts(req.user._id);
    
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/messages/:messageId - Delete a message
router.delete('/:messageId', verifyFirebaseToken, async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user is the sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own messages' });
    }
    
    await message.softDelete();
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/messages/conversations/:conversationId - Delete a conversation
router.delete('/conversations/:conversationId', verifyFirebaseToken, async (req, res) => {
  try {
    console.log('Delete conversation request:', {
      conversationId: req.params.conversationId,
      userId: req.user._id
    });

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.conversationId)) {
      console.log('Invalid conversation ID format:', req.params.conversationId);
      return res.status(400).json({ message: 'Invalid conversation ID format' });
    }

    // First, let's check if the conversation exists at all
    const conversationExists = await Conversation.findById(req.params.conversationId);
    console.log('Conversation exists check:', {
      id: req.params.conversationId,
      exists: !!conversationExists,
      conversation: conversationExists ? {
        id: conversationExists._id,
        type: conversationExists.type,
        club: conversationExists.club,
        isActive: conversationExists.isActive
      } : null
    });

    const { clubId, userRole } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      console.log('User not associated with any club');
      return res.status(400).json({ message: 'User is not associated with any club' });
    }
    
    // Only coaches and club managers can delete group chats
    if (userRole !== 'coach' && userRole !== 'clubManager') {
      console.log('User role not authorized:', userRole);
      return res.status(403).json({ message: 'Only coaches and club managers can delete group chats' });
    }
    
    const conversation = await Conversation.findById(req.params.conversationId).populate('participants.user', 'name email role');
    
    if (!conversation) {
      console.log('Conversation not found:', req.params.conversationId);
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    console.log('Found conversation:', {
      id: conversation._id,
      type: conversation.type,
      club: conversation.club,
      participants: conversation.participants.map(p => ({ 
        user: p.user._id || p.user, 
        userName: p.user.name || 'Unknown',
        role: p.role, 
        isActive: p.isActive 
      }))
    });
    
    // Check if user is a participant
    const isParticipant = conversation.participants.some(p => {
      const userId = p.user._id ? p.user._id.toString() : p.user.toString();
      return userId === req.user._id.toString() && p.isActive;
    });
    
    if (!isParticipant) {
      console.log('User is not a participant in this conversation');
      return res.status(403).json({ message: 'You are not a participant in this conversation' });
    }
    
    if (conversation.type !== 'group') {
      console.log('Conversation is not a group chat:', conversation.type);
      return res.status(400).json({ message: 'Only group conversations can be deleted' });
    }
    
    // Check if conversation belongs to user's club
    if (conversation.club.toString() !== clubId.toString()) {
      console.log('Conversation club mismatch:', {
        conversationClub: conversation.club.toString(),
        userClub: clubId.toString()
      });
      return res.status(403).json({ message: 'You can only delete conversations from your club' });
    }
    
    console.log('Deleting messages for conversation:', req.params.conversationId);
    // Delete all messages in the conversation
    const deletedMessages = await Message.deleteMany({ conversation: req.params.conversationId });
    console.log('Deleted messages count:', deletedMessages.deletedCount);
    
    console.log('Deleting conversation:', req.params.conversationId);
    // Delete the conversation
    await Conversation.findByIdAndDelete(req.params.conversationId);
    
    console.log('Conversation deleted successfully');
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/messages/unread-count - Get total unread message count
router.get('/unread-count', verifyFirebaseToken, async (req, res) => {
  try {
    const { clubId } = await getUserClubAndRole(req.user._id);
    
    if (!clubId) {
      return res.json({ unreadCount: 0 });
    }
    
    const conversations = await Conversation.find({
      club: clubId,
      'participants.user': req.user._id,
      'participants.isActive': true,
      isActive: true
    });
    
    let totalUnread = 0;
    conversations.forEach(conv => {
      const participant = conv.participants.find(p => 
        p.user.toString() === req.user._id.toString()
      );
      if (participant) {
        totalUnread += participant.unreadCount || 0;
      }
    });
    
    res.json({ unreadCount: totalUnread });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
