import express from 'express';
import multer from 'multer';
import Player from '../models/Player.js';
import Club from '../models/Club.js';
import User from '../models/User.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

// Configure multer for file uploads (in memory)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'), false);
    }
  }
});

// Validation middleware
const validatePlayerRegistration = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('phone').matches(/^(\+91[\s-]?)?[6-9]\d{9}$/).withMessage('Valid Indian phone number is required'),
  // Email comes from authenticated user; treat client email as optional
  body('email').optional().isEmail().withMessage('Valid email is required'),
  // Street can be optional per new UX
  body('address.street').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Street address must be 3-200 characters'),
  body('address.city').trim().isLength({ min: 2, max: 50 }).withMessage('City is required'),
  body('address.district').trim().isLength({ min: 2, max: 50 }).withMessage('District is required'),
  body('address.state').trim().isLength({ min: 2, max: 50 }).withMessage('State is required'),
  body('address.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('battingStyle').isIn(['right-handed', 'left-handed']).withMessage('Valid batting style is required'),
  body('bowlingStyle').isIn(['right-arm-fast', 'left-arm-fast', 'right-arm-medium', 'left-arm-medium', 'right-arm-spin', 'left-arm-spin', 'wicket-keeper', 'none']).withMessage('Valid bowling style is required'),
  body('preferredPosition').isIn(['batsman', 'bowler', 'all-rounder', 'wicket-keeper', 'fielder']).withMessage('Valid preferred position is required'),
  body('jerseyNumber').optional().isInt({ min: 0, max: 99 }).withMessage('Preferred jersey number must be between 0 and 99'),
  body('playingExperience').isIn(['beginner', '1-2 years', '3-5 years', '5-10 years', '10+ years']).withMessage('Valid playing experience is required')
];

// GET /api/players/profile - Get current player's profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id })
      .populate('currentClub', 'name clubName district city')
      .populate('applications.club', 'name clubName district city')
      .populate('applications.processedBy', 'name email');

    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Add computed field to indicate if profile photo exists
    const playerData = player.toObject();
    playerData.hasProfilePhoto = !!(player.profilePhoto && player.profilePhoto.data);
    
    console.log(`[DEBUG] Profile request - hasProfilePhoto: ${playerData.hasProfilePhoto}`);
    if (player.profilePhoto) {
      console.log(`[DEBUG] Profile request - photo data size: ${player.profilePhoto.data ? player.profilePhoto.data.length : 0} bytes`);
    }

    res.json({ player: playerData });
  } catch (error) {
    console.error('Error fetching player profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/players/register - Register as a player
router.post('/register', verifyFirebaseToken, validatePlayerRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a player profile
    const existingPlayer = await Player.findOne({ user: req.user._id });
    if (existingPlayer) {
      return res.status(400).json({ message: 'Player profile already exists' });
    }

    // Calculate age from date of birth
    const birthDate = new Date(req.body.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Validate age (must be between 16 and 50)
    if (age < 16 || age > 50) {
      return res.status(400).json({ message: 'Player age must be between 16 and 50 years' });
    }

    const playerData = {
      user: req.user._id,
      userUid: req.firebase?.uid || req.user.firebaseUid,
      ...req.body,
      age,
      email: req.user.email
    };

    const player = new Player(playerData);
    // Mark profile as completed upon successful registration (single-step registration)
    player.profileCompleted = true;
    await player.save();

    // Update user role to include player
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { role: 'player' } }
    );

    res.status(201).json({ 
      message: 'Player profile created successfully',
      player: await player.populate('currentClub', 'name clubName district city')
    });
  } catch (error) {
    console.error('Error creating player profile:', error);
    res.status(500).json({ message: error?.message || 'Server error' });
  }
});

// PUT /api/players/profile - Update player profile
router.put('/profile', verifyFirebaseToken, validatePlayerRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Calculate age from date of birth
    const birthDate = new Date(req.body.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Update player data
    Object.assign(player, req.body, { age });
    player.profileCompleted = true;
    
    await player.save();

    res.json({ 
      message: 'Player profile updated successfully',
      player: await player.populate('currentClub', 'name clubName district city')
    });
  } catch (error) {
    console.error('Error updating player profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/players/upload-document - Upload a document
router.post('/upload-document', verifyFirebaseToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Document name and type are required' });
    }

    const validTypes = ['certificate', 'scorecard', 'photo', 'reference'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    const document = {
      name,
      type,
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    player.documents.push(document);
    await player.save();

    res.json({ 
      message: 'Document uploaded successfully',
      documentId: player.documents[player.documents.length - 1]._id
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/document/:documentId - Get a document
router.get('/document/:documentId', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    const document = player.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `inline; filename="${document.name}"`
    });
    
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/players/document/:documentId - Delete a document
router.delete('/document/:documentId', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    const documentIndex = player.documents.findIndex(doc => doc._id.toString() === req.params.documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    player.documents.splice(documentIndex, 1);
    await player.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/players/upload-photo - Upload profile photo
router.post('/upload-photo', verifyFirebaseToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    player.profilePhoto = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await player.save();

    res.json({ message: 'Profile photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/debug - Debug player info (temporary)
router.get('/debug', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.json({ debug: 'No player profile found' });
    }
    
    const debugInfo = {
      playerId: player._id,
      userId: req.user._id,
      userEmail: req.user.email,
      hasProfilePhoto: !!(player.profilePhoto && player.profilePhoto.data),
      profilePhotoSize: player.profilePhoto?.data?.length || 0,
      profilePhotoContentType: player.profilePhoto?.contentType || null,
      documentsCount: player.documents?.length || 0
    };
    
    res.json({ debug: debugInfo });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ debug: 'Error', error: error.message });
  }
});

// GET /api/players/photo - Get profile photo
router.get('/photo', verifyFirebaseToken, async (req, res) => {
  try {
    console.log(`[DEBUG] Photo request from user: ${req.user._id} (${req.user.email})`);
    const player = await Player.findOne({ user: req.user._id });
    console.log(`[DEBUG] Player found: ${!!player}`);
    
    if (!player) {
      console.log(`[DEBUG] No player profile found for user: ${req.user._id}`);
      return res.status(404).json({ message: 'Player profile not found' });
    }
    
    console.log(`[DEBUG] Player has profile photo: ${!!(player.profilePhoto && player.profilePhoto.data)}`);
    if (player.profilePhoto) {
      console.log(`[DEBUG] Photo data size: ${player.profilePhoto.data ? player.profilePhoto.data.length : 0} bytes`);
      console.log(`[DEBUG] Photo content type: ${player.profilePhoto.contentType}`);
    }
    
    if (!player.profilePhoto || !player.profilePhoto.data) {
      console.log(`[DEBUG] No photo data found for user: ${req.user._id}`);
      return res.status(404).json({ message: 'Profile photo not found' });
    }
    
    // Set content type for image response with no-cache headers to prevent caching issues
    res.set({
      'Content-Type': player.profilePhoto.contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"${req.user._id}-${Date.now()}"` // Unique ETag per user and request
    });

    console.log(`[DEBUG] Sending photo data: ${player.profilePhoto.data.length} bytes`);
    res.send(player.profilePhoto.data);
  } catch (error) {
    console.error('Error fetching profile photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/players/apply-to-club/:clubId - Apply to a club
router.post('/apply-to-club/:clubId', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    if (!player.profileCompleted) {
      return res.status(400).json({ message: 'Please complete your profile before applying to clubs' });
    }

    const club = await Club.findById(req.params.clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (club.status !== 'approved') {
      return res.status(400).json({ message: 'Can only apply to approved clubs' });
    }

    if (!player.canApplyToClub(req.params.clubId)) {
      return res.status(400).json({ 
        message: 'Cannot apply to this club. You may have a pending application, already be a member of a club, or recently applied to this club.' 
      });
    }

    await player.addApplication(req.params.clubId);

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying to club:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// GET /api/players/applications - Get player's applications
router.get('/applications', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id })
      .populate('applications.club', 'name clubName district city logoUrl description memberCount')
      .populate('applications.processedBy', 'name email');
    
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    res.json({ applications: player.applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/players/applications/:id - Cancel a pending application
router.delete('/applications/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findOne({ user: req.user._id });
    
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Find the application
    const applicationIndex = player.applications.findIndex(
      app => app._id.toString() === id
    );

    if (applicationIndex === -1) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = player.applications[applicationIndex];

    // Check if application is pending (can only cancel pending applications)
    if (application.status !== 'pending') {
      return res.status(400).json({ 
        message: `Cannot cancel ${application.status} application. Only pending applications can be cancelled.` 
      });
    }

    // Remove the application
    player.applications.splice(applicationIndex, 1);
    await player.save();

    res.json({ message: 'Application cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/clubs/available - Get clubs available for application
router.get('/clubs/available', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Get approved clubs
    const clubs = await Club.find({ status: 'approved' })
      .select('name clubName district city logoUrl description memberCount')
      .sort({ name: 1, clubName: 1 });

    res.json({ clubs });
  } catch (error) {
    console.error('Error fetching available clubs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/club-status - Check if player is in a club (public endpoint for button logic)
router.get('/club-status', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id })
      .populate('currentClub', 'name clubName district city')
      .select('currentClub joinedClubAt applications');
    
    if (!player) {
      return res.json({ 
        hasClub: false, 
        canApply: false,
        message: 'Player profile not found. Please complete your profile first.' 
      });
    }

    // Check if player is already in a club
    if (player.currentClub) {
      return res.json({
        hasClub: true,
        canApply: false,
        currentClub: {
          id: player.currentClub._id,
          name: player.currentClub.clubName || player.currentClub.name,
          district: player.currentClub.district,
          city: player.currentClub.city
        },
        joinedAt: player.joinedClubAt,
        message: `Already a member of ${player.currentClub.clubName || player.currentClub.name}`
      });
    }

    // Check if player has any pending applications
    const pendingApplication = player.applications.find(app => app.status === 'pending');
    if (pendingApplication) {
      return res.json({
        hasClub: false,
        canApply: false,
        hasPendingApplication: true,
        message: 'You have a pending application. Please wait for the club manager to review it.'
      });
    }

    // Player can apply to clubs
    res.json({
      hasClub: false,
      canApply: true,
      message: 'You can apply to join clubs'
    });
  } catch (error) {
    console.error('Error checking player club status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/sessions - Get training sessions for the player's club (updated to include attendance information)
router.get('/sessions', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id }).populate('currentClub');
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Check if player is associated with a club
    if (!player.currentClub) {
      return res.status(400).json({ message: 'Player is not associated with any club' });
    }

    // Import Coach model
    const Coach = (await import('../models/Coach.js')).default;
    
    // Find the coach for this club
    const coach = await Coach.findOne({ currentClub: player.currentClub._id });
    if (!coach) {
      return res.status(404).json({ message: 'No coach found for this club' });
    }

    // Collect all sessions from all training programs
    const allSessions = [];
    coach.trainingPrograms.forEach(program => {
      program.sessions.forEach(session => {
        // Check if this player was marked as attended
        let playerAttendance = null;
        if (session.attendance) {
          const attendanceRecord = session.attendance.find(record => 
            record.player.toString() === player._id.toString()
          );
          if (attendanceRecord) {
            playerAttendance = {
              attended: attendanceRecord.attended,
              timestamp: attendanceRecord.timestamp
            };
          }
        }
        
        allSessions.push({
          _id: session._id,
          focusArea: session.focusArea,
          location: session.location,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          notes: session.notes,
          programId: program._id,
          programTitle: program.title,
          attendanceInfo: playerAttendance
        });
      });
    });

    res.json({ sessions: allSessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Club Manager Routes

// GET /api/players/club/applications - Get applications for club manager's club
router.get('/club/applications', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find all players with applications to this club
    const players = await Player.find({ 'applications.club': club._id })
      .populate('user', 'name email')
      .select('fullName age preferredPosition playingExperience applications careerHistory profilePhoto phone battingStyle bowlingStyle jerseyNumber statistics');

    // Filter and format applications for this club
    const applications = [];
    players.forEach(player => {
      const clubApplications = player.applications.filter(app => 
        app.club.toString() === club._id.toString()
      );
      
      clubApplications.forEach(app => {
        applications.push({
          _id: app._id,
          player: {
            _id: player._id,
            fullName: player.fullName,
            age: player.age,
            preferredPosition: player.preferredPosition,
            playingExperience: player.playingExperience,
            careerHistory: player.careerHistory,
            hasProfilePhoto: !!(player.profilePhoto && player.profilePhoto.data),
            phone: player.phone,
            battingStyle: player.battingStyle,
            bowlingStyle: player.bowlingStyle,
            jerseyNumber: player.jerseyNumber,
            statistics: player.statistics,
            user: player.user
          },
          status: app.status,
          appliedAt: app.appliedAt,
          processedAt: app.processedAt,
          rejectionReason: app.rejectionReason,
          approvalNotes: app.approvalNotes
        });
      });
    });

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching club applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/players/club/applications/:applicationId/approve - Approve an application
router.put('/club/applications/:applicationId/approve', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { approvalNotes } = req.body;

    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the player with this application
    const player = await Player.findOne({ 'applications._id': req.params.applicationId });
    if (!player) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = player.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify this application is for the manager's club
    if (application.club.toString() !== club._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to process this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application has already been processed' });
    }

    // Approve the application
    application.status = 'approved';
    application.processedAt = new Date();
    application.processedBy = req.user._id;
    application.approvalNotes = approvalNotes;

    // Set player's current club
    player.currentClub = club._id;
    player.joinedClubAt = new Date();

    await player.save();

    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/players/club/applications/:applicationId/reject - Reject an application
router.put('/club/applications/:applicationId/reject', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim().length < 10) {
      return res.status(400).json({ message: 'Rejection reason must be at least 10 characters long' });
    }

    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the player with this application
    const player = await Player.findOne({ 'applications._id': req.params.applicationId });
    if (!player) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = player.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify this application is for the manager's club
    if (application.club.toString() !== club._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to process this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ message: 'Application has already been processed' });
    }

    // Reject the application
    application.status = 'rejected';
    application.processedAt = new Date();
    application.processedBy = req.user.uid;
    application.rejectionReason = rejectionReason.trim();

    await player.save();

    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/club/player/:playerId - Get detailed player info for club manager
router.get('/club/player/:playerId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const player = await Player.findById(req.params.playerId)
      .populate('user', 'name email')
      .populate('applications.club', 'name clubName')
      .populate('currentClub', 'name clubName');

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if this player has applied to the manager's club
    const hasApplicationToClub = player.applications.some(app => 
      app.club._id.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this player' });
    }

    res.json({ player });
  } catch (error) {
    console.error('Error fetching player details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/club/player/:playerId/photo - Get player photo for club manager
router.get('/club/player/:playerId/photo', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if this player has applied to the manager's club
    const hasApplicationToClub = player.applications.some(app => 
      app.club.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this player' });
    }

    if (!player.profilePhoto || !player.profilePhoto.data) {
      return res.status(404).json({ message: 'Profile photo not found' });
    }

    res.set({
      'Content-Type': player.profilePhoto.contentType,
      'Cache-Control': 'public, max-age=86400'
    });
    
    res.send(player.profilePhoto.data);
  } catch (error) {
    console.error('Error fetching player photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/club/player/:playerId/document/:documentId - Get player document for club manager
router.get('/club/player/:playerId/document/:documentId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if this player has applied to the manager's club
    const hasApplicationToClub = player.applications.some(app => 
      app.club.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this player' });
    }

    const document = player.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `inline; filename="${document.name}"`
    });
    
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching player document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Routes

// GET /api/players/admin/all - Get all players (admin only)
router.get('/admin/all', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, search, district, status } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (district) {
      query['address.district'] = district;
    }
    
    if (status) {
      query.isActive = status === 'active';
    }

    const players = await Player.find(query)
      .populate('user', 'name email')
      .populate('currentClub', 'name clubName district')
      .select('fullName age preferredPosition playingExperience address.district currentClub isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Player.countDocuments(query);

    res.json({
      players,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all players:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/goals - Get goals set by coach for the current player
router.get('/goals', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Check if player is associated with a club
    if (!player.currentClub) {
      return res.status(400).json({ message: 'Player is not associated with any club' });
    }

    // Import Coach model
    const Coach = (await import('../models/Coach.js')).default;
    
    // Find the coach for this club
    const coach = await Coach.findOne({ currentClub: player.currentClub._id });
    if (!coach) {
      return res.status(404).json({ message: 'No coach found for this club' });
    }

    // Get goals for this player
    const playerGoals = coach.playerGoals.filter(goal => 
      goal.player.toString() === player._id.toString()
    );

    res.json({ goals: playerGoals });
  } catch (error) {
    console.error('Error fetching player goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/players/club/matches - Get matches for the player's club
router.get('/club/matches', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id }).populate('currentClub', 'name clubName district city');
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Check if player is associated with a club
    if (!player.currentClub) {
      return res.status(400).json({ message: 'Player is not associated with any club' });
    }

    // Import Match model
    const Match = (await import('../models/Match.js')).default;
    const Tournament = (await import('../models/Tournament.js')).default;

    // Find all matches where this club is either homeClub or awayClub
    const matches = await Match.find({
      $or: [
        { homeClub: player.currentClub._id },
        { awayClub: player.currentClub._id }
      ]
    })
    .populate('homeClub', 'clubName name logoUrl')
    .populate('awayClub', 'clubName name logoUrl')
    .populate('tournament', 'name status format')
    .sort({ date: 1, time: 1 });

    // Transform matches for frontend
    const formattedMatches = matches.map(match => {
      const isHomeTeam = match.homeClub._id.toString() === player.currentClub._id.toString();
      const opponent = isHomeTeam ? match.awayClub : match.homeClub;
      
      return {
        _id: match._id,
        date: match.date,
        time: match.time,
        venue: match.venue,
        status: match.status,
        round: match.round,
        stage: match.stage,
        tournament: {
          _id: match.tournament._id,
          name: match.tournament.name,
          status: match.tournament.status,
          format: match.tournament.format
        },
        homeClub: {
          _id: match.homeClub._id,
          name: match.homeClub.clubName || match.homeClub.name,
          logoUrl: match.homeClub.logoUrl
        },
        awayClub: {
          _id: match.awayClub._id,
          name: match.awayClub.clubName || match.awayClub.name,
          logoUrl: match.awayClub.logoUrl
        },
        opponent: {
          _id: opponent._id,
          name: opponent.clubName || opponent.name,
          logoUrl: opponent.logoUrl
        },
        isHomeTeam,
        score: match.score,
        result: match.result
      };
    });

    res.json({ matches: formattedMatches });
  } catch (error) {
    console.error('Error fetching club matches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/players/feedback - Get feedback from coach for the current player
router.get('/feedback', verifyFirebaseToken, async (req, res) => {
  try {
    const player = await Player.findOne({ user: req.user._id });
    if (!player) {
      return res.status(404).json({ message: 'Player profile not found' });
    }

    // Check if player is associated with a club
    if (!player.currentClub) {
      return res.status(400).json({ message: 'Player is not associated with any club' });
    }

    // Import Coach model
    const Coach = (await import('../models/Coach.js')).default;
    
    // Find the coach for this club
    const coach = await Coach.findOne({ currentClub: player.currentClub._id });
    if (!coach) {
      return res.status(404).json({ message: 'No coach found for this club' });
    }

    // Get feedback for this player
    const playerFeedback = coach.playerFeedback.filter(feedback => 
      feedback.player.toString() === player._id.toString()
    );

    res.json({ feedback: playerFeedback });
  } catch (error) {
    console.error('Error fetching player feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;