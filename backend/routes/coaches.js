import express from 'express';
import multer from 'multer';
import Coach from '../models/Coach.js';
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
const validateCoachRegistration = [
  body('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters'),
  body('dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('gender').isIn(['male', 'female', 'other']).withMessage('Valid gender is required'),
  body('phone').matches(/^(\+91[\s-]?)?[6-9]\d{9}$/).withMessage('Valid Indian phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('address.street').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Street address must be 3-200 characters'),
  body('address.city').trim().isLength({ min: 2, max: 50 }).withMessage('City is required'),
  body('address.district').trim().isLength({ min: 2, max: 50 }).withMessage('District is required'),
  body('address.state').trim().isLength({ min: 2, max: 50 }).withMessage('State is required'),
  body('address.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('coachingExperience').isIn(['beginner', '1-2 years', '3-5 years', '5-10 years', '10+ years']).withMessage('Valid coaching experience is required'),
  body('specializations').isArray().withMessage('Specializations must be an array'),
  body('specializations.*').isIn(['batting', 'bowling', 'fielding', 'wicket-keeping', 'fitness', 'mental-coaching', 'strategy', 'youth-development']).withMessage('Invalid specialization'),
  body('coachingPhilosophy').optional().trim().isLength({ max: 1000 }).withMessage('Coaching philosophy must be less than 1000 characters'),
  body('methodology').optional().trim().isLength({ max: 1000 }).withMessage('Methodology must be less than 1000 characters')
];

// GET /api/coaches/profile - Get current coach's profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id })
      .populate('currentClub', 'name clubName district city')
      .populate('applications.club', 'name clubName district city')
      .populate('applications.processedBy', 'name email');

    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Add computed field to indicate if profile photo exists
    const coachData = coach.toObject();
    coachData.hasProfilePhoto = !!(coach.profilePhoto && coach.profilePhoto.data);
    
    console.log(`[DEBUG] Coach profile request - hasProfilePhoto: ${coachData.hasProfilePhoto}`);

    res.json({ coach: coachData });
  } catch (error) {
    console.error('Error fetching coach profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/register - Register as a coach
router.post('/register', verifyFirebaseToken, validateCoachRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a coach profile
    const existingCoach = await Coach.findOne({ user: req.user._id });
    if (existingCoach) {
      return res.status(400).json({ message: 'Coach profile already exists' });
    }

    // Calculate age from date of birth
    const birthDate = new Date(req.body.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Validate age (must be between 18 and 70 for coaches)
    if (age < 18 || age > 70) {
      return res.status(400).json({ message: 'Coach age must be between 18 and 70 years' });
    }

    const coachData = {
      user: req.user._id,
      userUid: req.firebase?.uid || req.user.firebaseUid,
      ...req.body,
      age,
      email: req.user.email
    };

    const coach = new Coach(coachData);
    // Mark profile as completed upon successful registration
    coach.profileCompleted = true;
    await coach.save();

    // Update user role to include coach
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { role: 'coach' } }
    );

    res.status(201).json({ 
      message: 'Coach profile created successfully',
      coach: await coach.populate('currentClub', 'name clubName district city')
    });
  } catch (error) {
    console.error('Error creating coach profile:', error);
    res.status(500).json({ message: error?.message || 'Server error' });
  }
});

// PUT /api/coaches/profile - Update coach profile
router.put('/profile', verifyFirebaseToken, validateCoachRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Calculate age from date of birth
    const birthDate = new Date(req.body.dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    // Update coach data
    Object.assign(coach, req.body, { age });
    coach.profileCompleted = true;
    
    await coach.save();

    res.json({ 
      message: 'Coach profile updated successfully',
      coach: await coach.populate('currentClub', 'name clubName district city')
    });
  } catch (error) {
    console.error('Error updating coach profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/upload-document - Upload a document
router.post('/upload-document', verifyFirebaseToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, type } = req.body;
    if (!name || !type) {
      return res.status(400).json({ message: 'Document name and type are required' });
    }

    const validTypes = ['certificate', 'reference', 'portfolio', 'photo'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid document type' });
    }

    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const document = {
      name,
      type,
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    coach.documents.push(document);
    await coach.save();

    res.json({ 
      message: 'Document uploaded successfully',
      documentId: coach.documents[coach.documents.length - 1]._id
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/document/:documentId - Get a document
router.get('/document/:documentId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const document = coach.documents.id(req.params.documentId);
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

// DELETE /api/coaches/document/:documentId - Delete a document
router.delete('/document/:documentId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const documentIndex = coach.documents.findIndex(doc => doc._id.toString() === req.params.documentId);
    if (documentIndex === -1) {
      return res.status(404).json({ message: 'Document not found' });
    }

    coach.documents.splice(documentIndex, 1);
    await coach.save();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/upload-photo - Upload profile photo
router.post('/upload-photo', verifyFirebaseToken, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No photo uploaded' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Only image files are allowed' });
    }

    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    coach.profilePhoto = {
      data: req.file.buffer,
      contentType: req.file.mimetype
    };

    await coach.save();

    res.json({ message: 'Profile photo uploaded successfully' });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/photo - Get profile photo
router.get('/photo', verifyFirebaseToken, async (req, res) => {
  try {
    console.log(`[DEBUG] Coach photo request from user: ${req.user._id} (${req.user.email})`);
    const coach = await Coach.findOne({ user: req.user._id });
    console.log(`[DEBUG] Coach found: ${!!coach}`);
    
    if (!coach) {
      console.log(`[DEBUG] No coach profile found for user: ${req.user._id}`);
      return res.status(404).json({ message: 'Coach profile not found' });
    }
    
    console.log(`[DEBUG] Coach has profile photo: ${!!(coach.profilePhoto && coach.profilePhoto.data)}`);
    
    if (!coach.profilePhoto || !coach.profilePhoto.data) {
      console.log(`[DEBUG] No photo data found for coach: ${req.user._id}`);
      return res.status(404).json({ message: 'Profile photo not found' });
    }
    
    // Set content type for image response with no-cache headers
    res.set({
      'Content-Type': coach.profilePhoto.contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"${req.user._id}-${Date.now()}"`
    });

    console.log(`[DEBUG] Sending coach photo data: ${coach.profilePhoto.data.length} bytes`);
    res.send(coach.profilePhoto.data);
  } catch (error) {
    console.error('Error fetching coach profile photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/apply-to-club/:clubId - Apply to coach a club
router.post('/apply-to-club/:clubId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    if (!coach.profileCompleted) {
      return res.status(400).json({ message: 'Please complete your profile before applying to clubs' });
    }

    const club = await Club.findById(req.params.clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    if (club.status !== 'approved') {
      return res.status(400).json({ message: 'Can only apply to approved clubs' });
    }

    if (!coach.canApplyToClub(req.params.clubId)) {
      return res.status(400).json({ 
        message: 'Cannot apply to this club. You may have a pending application, already be associated with a club, or recently applied to this club.' 
      });
    }

    await coach.addApplication(req.params.clubId);

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying to club:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// GET /api/coaches/applications - Get coach's applications
router.get('/applications', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id })
      .populate('applications.club', 'name clubName district city logoUrl')
      .populate('applications.processedBy', 'name email');
    
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    res.json({ applications: coach.applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/clubs/available - Get clubs available for application
router.get('/clubs/available', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
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

// GET /api/coaches/club-status - Check if coach is associated with a club
router.get('/club-status', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id })
      .populate('currentClub', 'name clubName district city')
      .select('currentClub joinedClubAt applications');
    
    if (!coach) {
      return res.json({ 
        hasClub: false, 
        canApply: false,
        message: 'Coach profile not found. Please complete your profile first.' 
      });
    }

    // Check if coach is already associated with a club
    if (coach.currentClub) {
      return res.json({
        hasClub: true,
        canApply: false,
        currentClub: {
          id: coach.currentClub._id,
          name: coach.currentClub.clubName || coach.currentClub.name,
          district: coach.currentClub.district,
          city: coach.currentClub.city
        },
        joinedAt: coach.joinedClubAt,
        message: `Already coaching ${coach.currentClub.clubName || coach.currentClub.name}`
      });
    }

    // Check if coach has any pending applications
    const pendingApplication = coach.applications.find(app => app.status === 'pending');
    if (pendingApplication) {
      return res.json({
        hasClub: false,
        canApply: false,
        hasPendingApplication: true,
        message: 'You have a pending application. Please wait for the club manager to review it.'
      });
    }

    // Coach can apply to clubs
    res.json({
      hasClub: false,
      canApply: true,
      message: 'You can apply to coach clubs'
    });
  } catch (error) {
    console.error('Error checking coach club status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/resign-from-club - Resign from current club
router.post('/resign-from-club', verifyFirebaseToken, async (req, res) => {
  try {
    const { resignReason } = req.body;
    
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    await coach.resignFromClub(resignReason || '');

    res.json({ message: 'Successfully resigned from the club' });
  } catch (error) {
    console.error('Error resigning from club:', error);
    if (error.message === 'Not currently associated with any club') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/training-programs - Get all training programs for the coach
router.get('/training-programs', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    res.json({ trainingPrograms: coach.trainingPrograms });
  } catch (error) {
    console.error('Error fetching training programs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/training-programs - Create a new training program
router.post('/training-programs', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const trainingProgram = req.body;
    
    // Validate required fields
    if (!trainingProgram.title || !trainingProgram.description || !trainingProgram.startDate || !trainingProgram.endDate) {
      return res.status(400).json({ message: 'Title, description, start date, and end date are required' });
    }
    
    // Validate date logic
    if (new Date(trainingProgram.startDate) >= new Date(trainingProgram.endDate)) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Add the training program
    const newProgram = await coach.createTrainingProgram(trainingProgram);

    res.status(201).json({ 
      message: 'Training program created successfully',
      trainingProgram: newProgram.trainingPrograms[newProgram.trainingPrograms.length - 1]
    });
  } catch (error) {
    console.error('Error creating training program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/training-programs/:programId - Update a training program
router.put('/training-programs/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const trainingProgram = req.body;
    
    // Validate date logic if dates are provided
    if (trainingProgram.startDate && trainingProgram.endDate) {
      if (new Date(trainingProgram.startDate) >= new Date(trainingProgram.endDate)) {
        return res.status(400).json({ message: 'End date must be after start date' });
      }
    }
    
    // Update the training program
    await coach.updateTrainingProgram(req.params.programId, trainingProgram);

    res.json({ message: 'Training program updated successfully' });
  } catch (error) {
    console.error('Error updating training program:', error);
    if (error.message === 'Training program not found') {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/coaches/training-programs/:programId - Delete a training program
router.delete('/training-programs/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Delete the training program
    await coach.deleteTrainingProgram(req.params.programId);

    res.json({ message: 'Training program deleted successfully' });
  } catch (error) {
    console.error('Error deleting training program:', error);
    if (error.message === 'Training program not found') {
      return res.status(404).json({ message: 'Training program not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/training-programs/:programId - Get a specific training program
router.get('/training-programs/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const program = coach.trainingPrograms.id(req.params.programId);
    if (!program) {
      return res.status(404).json({ message: 'Training program not found' });
    }

    res.json({ trainingProgram: program });
  } catch (error) {
    console.error('Error fetching training program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/players-in-program/:programId - Get players in a training program
router.get('/players-in-program/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // In a real implementation, this would fetch players enrolled in the specific program
    // For now, we'll return mock data
    const mockPlayers = [
      {
        _id: '101',
        name: 'Rahul Sharma',
        preferredPosition: 'Batsman',
        lastUpdated: '2023-03-15',
        attendanceRate: 92,
        overallProgress: 78,
        skills: [
          { name: 'Batting Technique', progress: 85, notes: 'Improved footwork significantly' },
          { name: 'Shot Selection', progress: 72, notes: 'Working on aggressive shots' },
          { name: 'Mental Strength', progress: 65, notes: 'Needs more focus under pressure' }
        ],
        recentSessions: [
          { id: '1', date: '2023-03-15', focusArea: 'Cover Drive', notes: 'Excellent technique', attended: true },
          { id: '2', date: '2023-03-12', focusArea: 'Footwork', notes: 'Needs improvement', attended: true },
          { id: '3', date: '2023-03-10', focusArea: 'Shot Selection', notes: 'Good progress', attended: false }
        ],
        sessionsCompleted: 12,
        totalSessions: 15
      },
      {
        _id: '102',
        name: 'Vikram Patel',
        preferredPosition: 'Bowler',
        lastUpdated: '2023-03-14',
        attendanceRate: 85,
        overallProgress: 82,
        skills: [
          { name: 'Line & Length', progress: 90, notes: 'Consistent accuracy' },
          { name: 'Variations', progress: 75, notes: 'Working on slower balls' },
          { name: 'Fitness', progress: 80, notes: 'Good stamina levels' }
        ],
        recentSessions: [
          { id: '1', date: '2023-03-14', focusArea: 'Yorkers', notes: 'Excellent execution', attended: true },
          { id: '2', date: '2023-03-11', focusArea: 'Line & Length', notes: 'Consistent performance', attended: true },
          { id: '3', date: '2023-03-09', focusArea: 'Variations', notes: 'Needs more practice', attended: true }
        ],
        sessionsCompleted: 14,
        totalSessions: 15
      }
    ];

    res.json({ players: mockPlayers });
  } catch (error) {
    console.error('Error fetching players in program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/add-player-to-program - Add a player to a training program
router.post('/add-player-to-program', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { playerId, programId } = req.body;
    
    // In a real implementation, this would add the player to the program
    // For now, we'll just return a success message
    res.json({ message: 'Player added to program successfully' });
  } catch (error) {
    console.error('Error adding player to program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/coaches/remove-player-from-program/:playerId/:programId - Remove a player from a training program
router.delete('/remove-player-from-program/:playerId/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { playerId, programId } = req.params;
    
    // In a real implementation, this would remove the player from the program
    // For now, we'll just return a success message
    res.json({ message: 'Player removed from program successfully' });
  } catch (error) {
    console.error('Error removing player from program:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/player-progress - Add/update player progress
router.post('/player-progress', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const progressData = req.body;
    
    // Validate required fields
    if (!progressData.player || !progressData.program) {
      return res.status(400).json({ message: 'Player and program are required' });
    }
    
    // Check if progress record already exists
    const existingProgress = coach.playerProgress.find(p => 
      p.player.toString() === progressData.player && 
      p.program.toString() === progressData.program
    );
    
    if (existingProgress) {
      // Update existing progress
      Object.assign(existingProgress, progressData);
    } else {
      // Add new progress record
      coach.playerProgress.push(progressData);
    }
    
    await coach.save();
    
    res.json({ message: 'Player progress updated successfully' });
  } catch (error) {
    console.error('Error updating player progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/player-progress/:programId - Get all player progress for a program
router.get('/player-progress/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { programId } = req.params;
    
    const progressRecords = coach.getPlayerProgressForProgram(programId);
    
    res.json({ progressRecords });
  } catch (error) {
    console.error('Error fetching player progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/player-progress-detail/:playerId/:programId - Get detailed progress for a player in a program
router.get('/player-progress-detail/:playerId/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { playerId, programId } = req.params;
    
    const progressRecord = coach.playerProgress.find(p => 
      p.player.toString() === playerId && 
      p.program.toString() === programId
    );
    
    if (!progressRecord) {
      return res.status(404).json({ message: 'Player progress record not found' });
    }
    
    res.json({ progress: progressRecord });
  } catch (error) {
    console.error('Error fetching player progress detail:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/sessions - Get all sessions for the coach (updated to include attendance information)
router.get('/sessions', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Collect all sessions from all training programs
    const allSessions = [];
    coach.trainingPrograms.forEach(program => {
      program.sessions.forEach(session => {
        const attendedCount = session.attendance ? session.attendance.filter(a => a.attended).length : 0;
        allSessions.push({
          _id: session._id,
          focusArea: session.focusArea,
          location: session.location,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          notes: session.notes,
          attendees: attendedCount,
          attendanceInfo: {
            count: attendedCount,
            total: session.attendance ? session.attendance.length : 0
          }
        });
      });
    });

    res.json({ sessions: allSessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/sessions - Create a new training session
router.post('/sessions', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const sessionData = req.body;
    
    // Validate required fields
    if (!sessionData.date || !sessionData.startTime || !sessionData.endTime || 
        !sessionData.focusArea || !sessionData.location) {
      return res.status(400).json({ message: 'All session fields are required' });
    }
    
    // Validate date (cannot be in the past)
    const sessionDate = new Date(sessionData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (sessionDate < today) {
      return res.status(400).json({ message: 'Cannot schedule sessions on past dates' });
    }
    
    // Add session to a training program (find the first program or create a default one)
    if (coach.trainingPrograms.length === 0) {
      // Create a default program if none exists
      const defaultProgram = {
        title: 'General Training Program',
        description: 'Default training program for sessions',
        duration: 'Ongoing',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        skillFocus: [],
        difficultyLevel: 'intermediate',
        maxParticipants: 20,
        currentParticipants: 0,
        sessions: [],
        isActive: true
      };
      coach.trainingPrograms.push(defaultProgram);
    }
    
    // Add session to the first training program
    const program = coach.trainingPrograms[0];
    program.sessions.push({
      date: sessionData.date,
      startTime: sessionData.startTime,
      endTime: sessionData.endTime,
      location: sessionData.location,
      focusArea: sessionData.focusArea,
      notes: sessionData.notes
    });
    
    await coach.save();
    
    const newSession = program.sessions[program.sessions.length - 1];
    
    res.status(201).json({ 
      message: 'Session created successfully', 
      session: newSession,
      programId: program._id
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/sessions/:sessionId - Update a training session
router.put('/sessions/:sessionId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { sessionId } = req.params;
    const sessionData = req.body;
    
    // Find the program that contains this session
    let program = null;
    let sessionIndex = -1;
    
    for (let i = 0; i < coach.trainingPrograms.length; i++) {
      const prog = coach.trainingPrograms[i];
      const index = prog.sessions.findIndex(s => s._id.toString() === sessionId);
      if (index !== -1) {
        program = prog;
        sessionIndex = index;
        break;
      }
    }
    
    if (!program || sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Validate date (cannot be in the past)
    if (sessionData.date) {
      const sessionDate = new Date(sessionData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (sessionDate < today) {
        return res.status(400).json({ message: 'Cannot schedule sessions on past dates' });
      }
    }
    
    // Update session
    Object.assign(program.sessions[sessionIndex], sessionData);
    
    await coach.save();
    
    res.json({ 
      message: 'Session updated successfully',
      session: program.sessions[sessionIndex]
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/coaches/sessions/:sessionId - Delete a training session
router.delete('/sessions/:sessionId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { sessionId } = req.params;
    
    // Find the program that contains this session
    let programIndex = -1;
    let sessionIndex = -1;
    
    for (let i = 0; i < coach.trainingPrograms.length; i++) {
      const prog = coach.trainingPrograms[i];
      const index = prog.sessions.findIndex(s => s._id.toString() === sessionId);
      if (index !== -1) {
        programIndex = i;
        sessionIndex = index;
        break;
      }
    }
    
    if (programIndex === -1 || sessionIndex === -1) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    // Remove session
    coach.trainingPrograms[programIndex].sessions.splice(sessionIndex, 1);
    
    await coach.save();
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/sessions/:programId - Get all sessions for a training program
router.get('/sessions/:programId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { programId } = req.params;
    
    const program = coach.trainingPrograms.id(programId);
    if (!program) {
      return res.status(404).json({ message: 'Training program not found' });
    }
    
    res.json({ sessions: program.sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/sessions/:sessionId/attendance - Mark attendance for a session
router.post('/sessions/:sessionId/attendance', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { sessionId } = req.params;
    const { attendedPlayers } = req.body;

    // Validate attendedPlayers is an array
    if (!Array.isArray(attendedPlayers)) {
      return res.status(400).json({ message: 'attendedPlayers must be an array' });
    }

    // Find the program and session that contains this session
    let program = null;
    let session = null;
    let sessionIndex = -1;

    for (let i = 0; i < coach.trainingPrograms.length; i++) {
      const prog = coach.trainingPrograms[i];
      const index = prog.sessions.findIndex(s => s._id.toString() === sessionId);
      if (index !== -1) {
        program = prog;
        session = prog.sessions[index];
        sessionIndex = index;
        break;
      }
    }

    if (!program || !session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Update attendance for the session
    // First, clear existing attendance records
    session.attendance = [];

    // Add new attendance records
    attendedPlayers.forEach(playerId => {
      session.attendance.push({
        player: playerId,
        attended: true,
        timestamp: new Date()
      });
    });

    await coach.save();

    res.json({ 
      message: 'Attendance marked successfully',
      attendance: session.attendance
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/sessions/:sessionId/attendance - Get attendance for a session
router.get('/sessions/:sessionId/attendance', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    const { sessionId } = req.params;

    // Find the program and session that contains this session
    let session = null;

    for (let i = 0; i < coach.trainingPrograms.length; i++) {
      const prog = coach.trainingPrograms[i];
      const sess = prog.sessions.id(sessionId);
      if (sess) {
        session = sess;
        break;
      }
    }

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ 
      attendance: session.attendance
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Club Manager Routes

// GET /api/coaches/club/applications - Get applications for club manager's club
router.get('/club/applications', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find all coaches with applications to this club
    const coaches = await Coach.find({ 
      $or: [
        { 'applications.club': club._id },
        { 'resignHistory.club': club._id }
      ]
    })
      .populate('user', 'name email')
      .select('fullName age gender phone email address coachingExperience specializations coachingPhilosophy methodology coachingHistory certifications documents applications profilePhoto resignHistory');

    // Filter and format applications for this club
    const applications = [];
    coaches.forEach(coach => {
      // Add pending/approved/rejected applications
      const clubApplications = coach.applications.filter(app => 
        app.club.toString() === club._id.toString()
      );
      
      clubApplications.forEach(app => {
        applications.push({
          _id: app._id,
          coach: {
            _id: coach._id,
            fullName: coach.fullName,
            age: coach.age,
            gender: coach.gender,
            phone: coach.phone,
            email: coach.email,
            address: coach.address,
            coachingExperience: coach.coachingExperience,
            specializations: coach.specializations,
            coachingPhilosophy: coach.coachingPhilosophy,
            methodology: coach.methodology,
            coachingHistory: coach.coachingHistory,
            certifications: coach.certifications,
            documents: coach.documents.map(doc => ({
              _id: doc._id,
              name: doc.name,
              type: doc.type,
              uploadedAt: doc.uploadedAt
            })),
            hasProfilePhoto: !!(coach.profilePhoto && coach.profilePhoto.data),
            user: coach.user
          },
          status: app.status,
          appliedAt: app.appliedAt,
          processedAt: app.processedAt,
          rejectionReason: app.rejectionReason,
          approvalNotes: app.approvalNotes
        });
      });
      
      // Add resign history as pseudo-applications with 'resigned' status
      if (coach.resignHistory) {
        const clubResigns = coach.resignHistory.filter(record => 
          record.club.toString() === club._id.toString()
        );
        
        clubResigns.forEach(record => {
          applications.push({
            _id: record._id,
            coach: {
              _id: coach._id,
              fullName: coach.fullName,
              age: coach.age,
              gender: coach.gender,
              phone: coach.phone,
              email: coach.email,
              address: coach.address,
              coachingExperience: coach.coachingExperience,
              specializations: coach.specializations,
              coachingPhilosophy: coach.coachingPhilosophy,
              methodology: coach.methodology,
              coachingHistory: coach.coachingHistory,
              certifications: coach.certifications,
              documents: coach.documents.map(doc => ({
                _id: doc._id,
                name: doc.name,
                type: doc.type,
                uploadedAt: doc.uploadedAt
              })),
              hasProfilePhoto: !!(coach.profilePhoto && coach.profilePhoto.data),
              user: coach.user
            },
            status: 'resigned',
            appliedAt: record.resignedAt,
            resignationReason: record.reason,
            processedAt: record.resignedAt
          });
        });
      }
    });

    // Sort by application date (newest first)
    applications.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching club applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/club/applications/:applicationId/approve - Approve an application
router.put('/club/applications/:applicationId/approve', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { approvalNotes } = req.body;

    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the coach with this application
    const coach = await Coach.findOne({ 'applications._id': req.params.applicationId });
    if (!coach) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = coach.applications.id(req.params.applicationId);
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

    // Set coach's current club
    coach.currentClub = club._id;
    coach.joinedClubAt = new Date();

    await coach.save();

    res.json({ message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/club/applications/:applicationId/reject - Reject an application
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

    // Find the coach with this application
    const coach = await Coach.findOne({ 'applications._id': req.params.applicationId });
    if (!coach) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = coach.applications.id(req.params.applicationId);
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

    await coach.save();

    res.json({ message: 'Application rejected successfully' });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/coach/:coachId - Get detailed coach info for club manager
router.get('/club/coach/:coachId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const coach = await Coach.findById(req.params.coachId)
      .populate('user', 'name email')
      .populate('applications.club', 'name clubName')
      .populate('currentClub', 'name clubName');

    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if this coach has applied to the manager's club
    const hasApplicationToClub = coach.applications.some(app => 
      app.club._id.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this coach' });
    }

    res.json({ coach });
  } catch (error) {
    console.error('Error fetching coach details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/coach/:coachId/photo - Get coach photo for club manager
router.get('/club/coach/:coachId/photo', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const coach = await Coach.findById(req.params.coachId);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if this coach has applied to the manager's club
    const hasApplicationToClub = coach.applications.some(app => 
      app.club.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this coach' });
    }

    if (!coach.profilePhoto || !coach.profilePhoto.data) {
      return res.status(404).json({ message: 'Profile photo not found' });
    }

    res.set({
      'Content-Type': coach.profilePhoto.contentType,
      'Cache-Control': 'public, max-age=86400'
    });
    
    res.send(coach.profilePhoto.data);
  } catch (error) {
    console.error('Error fetching coach photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/coach/:coachId/document/:documentId - Get coach document for club manager
router.get('/club/coach/:coachId/document/:documentId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    const coach = await Coach.findById(req.params.coachId);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if this coach has applied to the manager's club
    const hasApplicationToClub = coach.applications.some(app => 
      app.club.toString() === club._id.toString()
    );

    if (!hasApplicationToClub) {
      return res.status(403).json({ message: 'Unauthorized to view this coach' });
    }

    const document = coach.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.set({
      'Content-Type': document.contentType,
      'Content-Disposition': `inline; filename="${document.name}"`
    });
    
    res.send(document.data);
  } catch (error) {
    console.error('Error fetching coach document:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/players - Get players from the coach's club
router.get('/club/players', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Find all players who are currently members of the coach's club
    const players = await Player.find({ 
      currentClub: coach.currentClub._id,
      isActive: true 
    })
    .populate('user', 'name email')
    .select('fullName age preferredPosition playingExperience battingStyle bowlingStyle joinedClubAt statistics profilePhoto')
    .sort({ joinedClubAt: -1 }); // Most recent first

    // Format player data for frontend display
    const formattedPlayers = players.map(player => ({
      _id: player._id,
      name: player.fullName,
      age: player.age,
      preferredPosition: player.preferredPosition,
      playingExperience: player.playingExperience,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
      joinedAt: player.joinedClubAt,
      statistics: player.statistics,
      hasProfilePhoto: !!(player.profilePhoto && player.profilePhoto.data)
    }));

    res.json({ 
      club: {
        id: coach.currentClub._id,
        name: coach.currentClub.clubName || coach.currentClub.name,
        district: coach.currentClub.district,
        city: coach.currentClub.city
      },
      players: formattedPlayers
    });
  } catch (error) {
    console.error('Error fetching club players:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/player/:playerId - Get detailed player info for coach
router.get('/club/player/:playerId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    const player = await Player.findById(req.params.playerId)
      .populate('user', 'name email')
      .populate('currentClub', 'name clubName district city');

    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if this player is in the coach's club
    if (player.currentClub?._id.toString() !== coach.currentClub._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to view this player' });
    }

    // Add computed field to indicate if profile photo exists
    const playerData = player.toObject();
    playerData.hasProfilePhoto = !!(player.profilePhoto && player.profilePhoto.data);

    res.json({ player: playerData });
  } catch (error) {
    console.error('Error fetching player details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/sessions - Get all training sessions for club manager
router.get('/club/sessions', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the coach for this club
    const coach = await Coach.findOne({ currentClub: club._id });
    if (!coach) {
      return res.status(404).json({ message: 'No coach found for this club' });
    }

    // Collect all sessions from all training programs with attendance information
    const allSessions = [];
    coach.trainingPrograms.forEach(program => {
      program.sessions.forEach(session => {
        const attendedCount = session.attendance ? session.attendance.filter(a => a.attended).length : 0;
        allSessions.push({
          _id: session._id,
          focusArea: session.focusArea,
          location: session.location,
          date: session.date,
          startTime: session.startTime,
          endTime: session.endTime,
          notes: session.notes,
          attendees: attendedCount,
          totalPlayers: session.attendance ? session.attendance.length : 0,
          attendanceInfo: {
            count: attendedCount,
            total: session.attendance ? session.attendance.length : 0
          },
          programId: program._id,
          programTitle: program.title
        });
      });
    });

    // Sort sessions by date (newest first)
    allSessions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ sessions: allSessions });
  } catch (error) {
    console.error('Error fetching club sessions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/session-attendance/:sessionId - Get session attendance for club manager
router.get('/club/session-attendance/:sessionId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the coach for this club
    const coach = await Coach.findOne({ currentClub: club._id });
    if (!coach) {
      return res.status(404).json({ message: 'No coach found for this club' });
    }

    const { sessionId } = req.params;

    // Find the session
    let session = null;
    for (let i = 0; i < coach.trainingPrograms.length; i++) {
      const prog = coach.trainingPrograms[i];
      const sess = prog.sessions.id(sessionId);
      if (sess) {
        session = sess;
        break;
      }
    }

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Populate player details for attendance records
    const Player = (await import('../models/Player.js')).default;
    const playerIds = session.attendance.map(record => record.player);
    const players = await Player.find({ _id: { $in: playerIds } })
      .select('fullName preferredPosition');

    // Create a map of player ID to player details
    const playerMap = {};
    players.forEach(player => {
      playerMap[player._id.toString()] = {
        name: player.fullName,
        position: player.preferredPosition
      };
    });

    // Enrich attendance records with player details
    const enrichedAttendance = session.attendance.map(record => ({
      playerId: record.player,
      attended: record.attended,
      timestamp: record.timestamp,
      player: playerMap[record.player.toString()] || { name: 'Unknown Player', position: 'N/A' }
    }));

    res.json({ 
      session: {
        _id: session._id,
        focusArea: session.focusArea,
        location: session.location,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        notes: session.notes
      },
      attendance: enrichedAttendance
    });
  } catch (error) {
    console.error('Error fetching session attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/club/matches - Get matches for the coach's club
router.get('/club/matches', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub', 'name clubName district city');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Import Match model
    const Match = (await import('../models/Match.js')).default;
    const Tournament = (await import('../models/Tournament.js')).default;

    // Find all matches where this club is either homeClub or awayClub
    const matches = await Match.find({
      $or: [
        { homeClub: coach.currentClub._id },
        { awayClub: coach.currentClub._id }
      ]
    })
    .populate('homeClub', 'clubName name logoUrl')
    .populate('awayClub', 'clubName name logoUrl')
    .populate('tournament', 'name status format')
    .sort({ date: 1, time: 1 });

    // Transform matches for frontend
    const formattedMatches = matches.map(match => {
      const isHomeTeam = match.homeClub._id.toString() === coach.currentClub._id.toString();
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

// GET /api/coaches/club/players - Get players for the coach's club
router.get('/club/players', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub', 'name clubName');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;

    // Find all active players who are currently members of this club
    const players = await Player.find({ 
      currentClub: coach.currentClub._id,
      isActive: true 
    })
    .select('fullName age preferredPosition battingStyle bowlingStyle jerseyNumber')
    .sort({ fullName: 1 });

    // Format player data
    const formattedPlayers = players.map(player => ({
      _id: player._id,
      fullName: player.fullName,
      age: player.age,
      position: player.preferredPosition,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
      jerseyNumber: player.jerseyNumber || null
    }));

    res.json({ 
      players: formattedPlayers,
      totalPlayers: formattedPlayers.length,
      clubName: coach.currentClub.clubName || coach.currentClub.name
    });
  } catch (error) {
    console.error('Error fetching club players:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin Routes

// GET /api/coaches/admin/all - Get all coaches (admin only)
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

    const coaches = await Coach.find(query)
      .populate('user', 'name email')
      .populate('currentClub', 'name clubName district')
      .select('fullName age coachingExperience specializations address.district currentClub isActive createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coach.countDocuments(query);

    res.json({
      coaches,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching all coaches:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/goals - Set a goal for a player
router.post('/goals', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { playerId, title, description, targetType, targetValue, deadline } = req.body;
    
    // Validate required fields
    if (!playerId || !title || !targetType || !targetValue || !deadline) {
      return res.status(400).json({ message: 'Player ID, title, target type, target value, and deadline are required' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Check if player exists and is in the same club
    const player = await Player.findOne({ 
      _id: playerId, 
      currentClub: coach.currentClub._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found or not in your club' });
    }

    // Create new goal
    const newGoal = {
      player: playerId,
      title,
      description,
      targetType,
      targetValue,
      deadline: new Date(deadline),
      status: 'pending'
    };

    coach.playerGoals.push(newGoal);
    await coach.save();

    res.status(201).json({ 
      message: 'Goal set successfully',
      goal: newGoal
    });
  } catch (error) {
    console.error('Error setting player goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/goals/:playerId - Get all goals for a specific player
router.get('/goals/:playerId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { playerId } = req.params;
    
    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Check if player exists and is in the same club
    const player = await Player.findOne({ 
      _id: playerId, 
      currentClub: coach.currentClub._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found or not in your club' });
    }

    // Get goals for this player
    const playerGoals = coach.playerGoals.filter(goal => 
      goal.player.toString() === playerId
    );

    res.json({ goals: playerGoals });
  } catch (error) {
    console.error('Error fetching player goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/goals - Get all goals for the current coach
router.get('/goals', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Return all goals for this coach
    res.json({ goals: coach.playerGoals });
  } catch (error) {
    console.error('Error fetching coach goals:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/goals/:goalId - Update a specific goal
router.put('/goals/:goalId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { goalId } = req.params;
    const { title, description, targetType, targetValue, currentValue, deadline, status } = req.body;
    
    // Find the goal
    const goal = coach.playerGoals.id(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update goal fields
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetType !== undefined) goal.targetType = targetType;
    if (targetValue !== undefined) goal.targetValue = targetValue;
    if (currentValue !== undefined) goal.currentValue = currentValue;
    if (deadline !== undefined) goal.deadline = new Date(deadline);
    if (status !== undefined) goal.status = status;
    
    // Update the updatedAt timestamp
    goal.updatedAt = new Date();
    
    await coach.save();

    res.json({ 
      message: 'Goal updated successfully',
      goal: goal
    });
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/coaches/goals/:goalId/progress - Update progress of a specific goal
router.put('/goals/:goalId/progress', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { goalId } = req.params;
    const { currentValue, status } = req.body;
    
    // Find the goal
    const goal = coach.playerGoals.id(goalId);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update progress fields
    if (currentValue !== undefined) {
      // Ensure currentValue doesn't exceed targetValue
      const validatedCurrentValue = Math.min(currentValue, goal.targetValue);
      goal.currentValue = validatedCurrentValue;
      
      // Auto-update status based on progress
      if (validatedCurrentValue >= goal.targetValue) {
        goal.status = 'achieved';
      } else if (validatedCurrentValue > 0) {
        goal.status = 'in-progress';
      } else {
        goal.status = 'pending';
      }
    }
    
    if (status !== undefined) goal.status = status;
    
    // Update the updatedAt timestamp
    goal.updatedAt = new Date();
    
    await coach.save();

    res.json({ 
      message: 'Goal progress updated successfully',
      goal: goal
    });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/coaches/feedback - Send feedback to a player
router.post('/feedback', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { playerId, session, title, content, type, priority } = req.body;
    
    // Validate required fields
    if (!playerId || !title || !content) {
      return res.status(400).json({ message: 'Player ID, title, and content are required' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Check if player exists and is in the same club
    const player = await Player.findOne({ 
      _id: playerId, 
      currentClub: coach.currentClub._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found or not in your club' });
    }

    // Create new feedback
    const newFeedback = {
      player: playerId,
      session,
      title,
      content,
      type: type || 'general',
      priority: priority || 'medium',
      isRead: false
    };

    coach.playerFeedback.push(newFeedback);
    await coach.save();

    res.status(201).json({ 
      message: 'Feedback sent successfully',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error sending player feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/feedback/:playerId - Get all feedback for a specific player
router.get('/feedback/:playerId', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const { playerId } = req.params;
    
    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Check if player exists and is in the same club
    const player = await Player.findOne({ 
      _id: playerId, 
      currentClub: coach.currentClub._id 
    });
    
    if (!player) {
      return res.status(404).json({ message: 'Player not found or not in your club' });
    }

    // Get feedback for this player
    const playerFeedback = coach.playerFeedback.filter(feedback => 
      feedback.player.toString() === playerId
    );

    res.json({ feedback: playerFeedback });
  } catch (error) {
    console.error('Error fetching player feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/coaches/feedback - Get all feedback for the current coach
router.get('/feedback', verifyFirebaseToken, async (req, res) => {
  try {
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    // Check if coach is associated with a club
    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Return all feedback for this coach
    res.json({ feedback: coach.playerFeedback });
  } catch (error) {
    console.error('Error fetching coach feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
