import express from 'express';
import Joi from 'joi';
import { Router } from 'express';
import Club from '../models/Club.js';
import Player from '../models/Player.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logger } from '../utils/logger.js';
import multer from 'multer';

// In-memory storage as we store binaries in MongoDB
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

// Enhanced club registration schema with better validation
const clubRegistrationSchema = Joi.object({
  clubName: Joi.string().trim().min(3).max(100).required()
    .messages({
      'string.min': 'Club name must be at least 3 characters',
      'string.max': 'Club name must be less than 100 characters',
      'any.required': 'Club name is required'
    }),
  district: Joi.string().trim().min(1).max(50).required()
    .messages({
      'any.required': 'District is required'
    }),
  city: Joi.string().trim().min(1).max(50).required()
    .messages({
      'any.required': 'City is required'
    }),
  foundedYear: Joi.number().integer().min(1850).max(new Date().getFullYear()).optional()
    .messages({
      'number.min': 'Founded year must be after 1850',
      'number.max': `Founded year cannot be in the future`
    }),
  managerName: Joi.string().trim().min(2).max(100).pattern(/^[a-zA-Z\s.'-]+$/).required()
    .messages({
      'string.pattern.base': 'Manager name contains invalid characters',
      'any.required': 'Manager name is required'
    }),
  phone: Joi.string().trim().pattern(/^(\+91[\s-]?)?[6-9]\d{9}$/).required()
    .messages({
      'string.pattern.base': 'Please enter a valid Indian phone number',
      'any.required': 'Phone number is required'
    }),
  email: Joi.string().trim().email().required()
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required'
    }),
  description: Joi.string().trim().max(1000).optional()
    .messages({
      'string.max': 'Description must be less than 1000 characters'
    }),
  groundName: Joi.string().trim().max(100).optional()
    .messages({
      'string.max': 'Ground name must be less than 100 characters'
    }),
  memberCount: Joi.number().integer().min(1).max(10000).optional()
    .messages({
      'number.min': 'Member count must be at least 1',
      'number.max': 'Member count seems too high'
    }),
  website: Joi.string().trim().uri().allow('').optional()
    .messages({
      'string.uri': 'Please enter a valid URL'
    }),
  achievements: Joi.string().trim().max(1000).optional()
    .messages({
      'string.max': 'Achievements must be less than 1000 characters'
    }),
  // Accept http/https and data URLs for now (replace with real upload URL later)
  logoUrl: Joi.string().uri({ scheme: [/https?/, 'data'] }).optional(),
  bannerUrl: Joi.string().uri({ scheme: [/https?/, 'data'] }).optional(),
  agreeTerms: Joi.boolean().valid(true).required()
    .messages({
      'any.only': 'You must agree to the terms and conditions'
    }),
  status: Joi.string().valid('pending').default('pending')
});

// Add a custom validation to check for proof document
const validateClubRegistration = (body, files) => {
  // First run the schema validation
  const { value, error } = clubRegistrationSchema.unknown(true).validate(body);
  
  if (error) {
    return { value, error };
  }
  
  // Check if proof document is provided
  if (!files || !files.proof || !files.proof[0]) {
    return { 
      value, 
      error: { 
        details: [{ message: 'Proof document is required for club registration' }] 
      } 
    };
  }
  
  return { value, error: null };
};

// Club registration (restricted to club managers)
// Accept multipart/form-data with fields and files: logo (optional), proof (required)
router.post('/register', verifyFirebaseToken, requireRole('clubManager'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'proof', maxCount: 1 }
]), async (req, res) => {
  try {
    logger.info('Club registration attempt', { 
      userId: req.user._id, 
      email: req.user.email,
      clubName: req.body.clubName 
    });

    // Combine text fields from multipart form
    const body = req.body || {};

    // Use custom validation that checks for proof document
    const { value, error } = validateClubRegistration(body, req.files);
    if (error) {
      logger.warn('Club registration validation failed', { 
        userId: req.user._id, 
        error: error.details[0].message 
      });
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already has a club registration
    const existingClub = await Club.findOne({ 
      $or: [
        { manager: req.user._id },
        { email: value.email }
      ]
    });

    if (existingClub) {
      // If the existing registration was rejected, allow re-submission by updating it
      if (existingClub.status === 'rejected' && String(existingClub.manager) === String(req.user._id)) {
        // Apply new values
        Object.assign(existingClub, value);

        // If logoUrl is a data URL, convert and store binary in MongoDB
        if (value.logoUrl && typeof value.logoUrl === 'string' && value.logoUrl.startsWith('data:')) {
          const match = value.logoUrl.match(/^data:(.*?);base64,(.*)$/);
          if (match) {
            const [, mime, b64] = match;
            try { existingClub.logo = { data: Buffer.from(b64, 'base64'), contentType: mime }; } catch {}
          }
        }

        existingClub.status = 'pending';
        existingClub.submittedAt = new Date();
        existingClub.processedAt = null;
        existingClub.processedBy = null;
        existingClub.rejectionReason = undefined;

        await existingClub.save();

        return res.status(200).json({ 
          message: 'Club re-submitted successfully. You will receive an email once reviewed.',
          club: {
            id: existingClub._id,
            clubName: existingClub.clubName,
            status: existingClub.status,
            submittedAt: existingClub.submittedAt
          }
        });
      }

      return res.status(400).json({ 
        message: 'You already have a club registration. Please contact admin if you need to update it.' 
      });
    }

    // Read files from multipart upload
    let logo;
    let proof;
    const logoFile = req.files?.logo?.[0];
    const proofFile = req.files?.proof?.[0];
    
    if (logoFile) {
      logo = { data: logoFile.buffer, contentType: logoFile.mimetype };
      // ensure no foreign URL sent
      delete value.logoUrl;
    }
    
    if (proofFile) {
      proof = { data: proofFile.buffer, contentType: proofFile.mimetype };
    }

    const club = await Club.create({
      ...value,
      logo,
      proof,
      manager: req.user._id,
      submittedAt: new Date(),
      status: 'pending'
    });

    // Set stable URL if logo exists
    if (logo) {
      club.logoUrl = `/api/clubs/${club._id}/logo`;
    }
    await club.save();

    res.status(201).json({ 
      message: 'Club registration submitted successfully. You will receive an email once reviewed.',
      club: {
        id: club._id,
        clubName: club.clubName,
        status: club.status,
        submittedAt: club.submittedAt,
        logoUrl: club.logoUrl
      }
    });
  } catch (error) {
    console.error('Club registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's club (for club manager dashboard)
router.get('/my-club', verifyFirebaseToken, async (req, res) => {
  try {
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found' });
    }
    res.json({ club });
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get club statistics for club manager dashboard
router.get('/my-club/stats', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found' });
    }

    // Import Tournament model
    const Tournament = (await import('../models/Tournament.js')).default;

    // Count tournaments this club has applied to
    let tournamentCount = 0;
    let approvedTournaments = 0;
    let pendingTournaments = 0;

    try {
      const tournaments = await Tournament.find({
        'registrations.club': club._id
      }).select('registrations status');

      tournamentCount = tournaments.length;
      
      tournaments.forEach(tournament => {
        const clubReg = tournament.registrations.find(
          reg => reg.club.toString() === club._id.toString()
        );
        if (clubReg) {
          if (clubReg.status === 'approved') approvedTournaments++;
          if (clubReg.status === 'pending') pendingTournaments++;
        }
      });
    } catch (tournamentError) {
      console.warn('Failed to load tournament stats:', tournamentError);
    }

    const stats = {
      players: club.memberCount || 0,
      tournaments: tournamentCount,
      approvedTournaments,
      pendingTournaments,
      pendingApplications: 0, // TODO: Count pending player applications to this club
      upcomingMatches: 0, // TODO: Count upcoming matches for this club
      foundedYear: club.foundedYear,
      totalMembers: club.memberCount || 0,
      status: club.status,
      registrationDate: club.submittedAt,
      approvalDate: club.processedAt
    };

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching club stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get club's tournament applications
router.get('/my-club/tournaments', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found' });
    }

    // Import Tournament and Payment models
    const Tournament = (await import('../models/Tournament.js')).default;
    const Payment = (await import('../models/Payment.js')).default;

    // Find all tournaments where this club has applied
    const tournaments = await Tournament.find({
      'registrations.club': club._id
    }).select('name description district location startDate endDate status format entryFee prizePool maxTeams registrations')
      .sort({ startDate: -1 });

    // Get all payments for this club
    const payments = await Payment.find({
      club: club._id,
      tournament: { $in: tournaments.map(t => t._id) }
    }).select('tournament status verification');

    // Create a map of tournament ID to payment status
    const paymentMap = {};
    payments.forEach(payment => {
      paymentMap[payment.tournament.toString()] = {
        status: payment.status,
        verified: payment.verification?.verified || false,
        paymentId: payment.paymentId
      };
    });

    // Transform data to include club's application status and payment status
    const clubTournaments = tournaments.map(tournament => {
      const clubRegistration = tournament.registrations.find(
        reg => reg.club.toString() === club._id.toString()
      );
      
      const paymentInfo = paymentMap[tournament._id.toString()];
      const hasPaid = paymentInfo && paymentInfo.status === 'paid' && paymentInfo.verified;

      return {
        id: tournament._id,
        name: tournament.name,
        description: tournament.description,
        district: tournament.district,
        location: tournament.location,
        startDate: tournament.startDate,
        endDate: tournament.endDate,
        status: tournament.status,
        format: tournament.format,
        entryFee: tournament.entryFee,
        prizePool: tournament.prizePool,
        maxTeams: tournament.maxTeams,
        totalRegistrations: tournament.registrations.length,
        applicationStatus: clubRegistration?.status || 'not_applied',
        appliedAt: clubRegistration?.appliedAt,
        decisionAt: clubRegistration?.decisionAt,
        rejectionReason: clubRegistration?.reason,
        paymentStatus: hasPaid ? 'paid' : (paymentInfo ? paymentInfo.status : 'pending'),
        paymentVerified: hasPaid
      };
    });

    res.json({ tournaments: clubTournaments });
  } catch (error) {
    console.error('Error fetching club tournaments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get club's matches from tournaments
router.get('/matches', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found' });
    }

    // Import Match model
    const Match = (await import('../models/Match.js')).default;
    const Tournament = (await import('../models/Tournament.js')).default;

    // Find all matches where this club is either homeClub or awayClub
    const matches = await Match.find({
      $or: [
        { homeClub: club._id },
        { awayClub: club._id }
      ]
    })
    .populate('homeClub', 'clubName name logoUrl')
    .populate('awayClub', 'clubName name logoUrl')
    .populate('tournament', 'name status format')
    .sort({ date: 1, time: 1 });

    // Transform matches for frontend
    const formattedMatches = matches.map(match => {
      const isHomeTeam = match.homeClub._id.toString() === club._id.toString();
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

// Get club activity/recent events for club manager dashboard
router.get('/my-club/activity', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found' });
    }

    // Import Tournament model
    const Tournament = (await import('../models/Tournament.js')).default;

    // Create activity log based on club data
    const activity = [];
    
    if (club.submittedAt) {
      activity.push({
        id: `club-submitted-${club._id}`,
        type: 'registration',
        message: `Club "${club.clubName}" registration submitted`,
        timestamp: club.submittedAt,
        icon: 'upload'
      });
    }

    if (club.processedAt && club.status === 'approved') {
      activity.push({
        id: `club-approved-${club._id}`,
        type: 'approval',
        message: `Club registration approved`,
        timestamp: club.processedAt,
        icon: 'check'
      });
    }

    if (club.processedAt && club.status === 'rejected') {
      activity.push({
        id: `club-rejected-${club._id}`,
        type: 'rejection',
        message: `Club registration rejected: ${club.rejectionReason || 'No reason provided'}`,
        timestamp: club.processedAt,
        icon: 'x'
      });
    }

    // Add player application activities
    try {
      const Player = (await import('../models/Player.js')).default;
      
      const players = await Player.find({ 'applications.club': club._id })
        .populate('user', 'name email')
        .select('fullName applications')
        .sort({ 'applications.processedAt': -1 })
        .limit(10);

      players.forEach(player => {
        const clubApplications = player.applications.filter(app => 
          app.club.toString() === club._id.toString()
        );
        
        clubApplications.forEach(app => {
          // Add application submitted activity
          activity.push({
            id: `player-applied-${app._id}`,
            type: 'player-application',
            message: `${player.fullName} applied to join the club`,
            timestamp: app.appliedAt,
            icon: 'user-plus'
          });

          // Add approval/rejection activity if processed
          if (app.processedAt && app.status !== 'pending') {
            activity.push({
              id: `player-${app.status}-${app._id}`,
              type: app.status === 'approved' ? 'player-approved' : 'player-rejected',
              message: app.status === 'approved' 
                ? `${player.fullName} was approved and joined the club`
                : `${player.fullName}'s application was rejected`,
              timestamp: app.processedAt,
              icon: app.status === 'approved' ? 'user-check' : 'user-x'
            });
          }
        });
      });
    } catch (playerError) {
      console.warn('Failed to load player activities:', playerError);
    }

    // Add coach application activities
    try {
      const Coach = (await import('../models/Coach.js')).default;
      
      const coaches = await Coach.find({ 
        $or: [
          { 'applications.club': club._id },
          { 'resignHistory.club': club._id }
        ]
      })
        .populate('user', 'name email')
        .select('fullName applications resignHistory')
        .sort({ 'applications.processedAt': -1, 'resignHistory.resignedAt': -1 })
        .limit(10);

      coaches.forEach(coach => {
        const clubApplications = coach.applications.filter(app => 
          app.club.toString() === club._id.toString()
        );
        
        clubApplications.forEach(app => {
          // Add application submitted activity
          activity.push({
            id: `coach-applied-${app._id}`,
            type: 'coach-application',
            message: `${coach.fullName} applied to coach the club`,
            timestamp: app.appliedAt,
            icon: 'user-plus'
          });

          // Add approval/rejection activity if processed
          if (app.processedAt && app.status !== 'pending') {
            activity.push({
              id: `coach-${app.status}-${app._id}`,
              type: app.status === 'approved' ? 'coach-approved' : 'coach-rejected',
              message: app.status === 'approved' 
                ? `${coach.fullName} was approved and joined the club as coach`
                : `${coach.fullName}'s application was rejected`,
              timestamp: app.processedAt,
              icon: app.status === 'approved' ? 'user-check' : 'user-x'
            });
          }
        });
        
        // Add resign activities
        if (coach.resignHistory) {
          const clubResigns = coach.resignHistory.filter(record => 
            record.club.toString() === club._id.toString()
          );
          
          clubResigns.forEach(record => {
            activity.push({
              id: `coach-resigned-${record._id}`,
              type: 'coach-resigned',
              message: `${coach.fullName} resigned from the club${record.reason ? `: ${record.reason}` : ''}`,
              timestamp: record.resignedAt,
              icon: 'user-x'
            });
          });
        }
      });
    } catch (coachError) {
      console.warn('Failed to load coach activities:', coachError);
    }

    // Add tournament application activities
    try {
      const tournaments = await Tournament.find({
        'registrations.club': club._id
      }).select('name registrations').sort({ createdAt: -1 }).limit(5);

      tournaments.forEach(tournament => {
        const clubReg = tournament.registrations.find(
          reg => reg.club.toString() === club._id.toString()
        );
        
        if (clubReg) {
          activity.push({
            id: `tournament-applied-${tournament._id}`,
            type: 'tournament',
            message: `Applied to tournament "${tournament.name}"`,
            timestamp: clubReg.appliedAt,
            icon: 'calendar'
          });

          if (clubReg.decisionAt) {
            activity.push({
              id: `tournament-decision-${tournament._id}`,
              type: clubReg.status === 'approved' ? 'tournament-approved' : 'tournament-rejected',
              message: `Tournament "${tournament.name}" application ${clubReg.status}`,
              timestamp: clubReg.decisionAt,
              icon: clubReg.status === 'approved' ? 'check' : 'x'
            });
          }
        }
      });
    } catch (tournamentError) {
      console.warn('Failed to load tournament activities:', tournamentError);
    }
    
    // Add training session activities
    try {
      const Coach = (await import('../models/Coach.js')).default;
      
      // Find the coach for this club
      const coach = await Coach.findOne({ currentClub: club._id });
      
      if (coach) {
        // Collect all sessions and add recent ones to activity
        const allSessions = [];
        coach.trainingPrograms.forEach(program => {
          program.sessions.forEach(session => {
            allSessions.push({
              _id: session._id,
              focusArea: session.focusArea,
              date: session.date,
              attendanceCount: session.attendance ? session.attendance.filter(a => a.attended).length : 0,
              totalPlayers: session.attendance ? session.attendance.length : 0
            });
          });
        });
        
        // Sort by date and take the 5 most recent
        allSessions.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recentSessions = allSessions.slice(0, 5);
        
        recentSessions.forEach(session => {
          activity.push({
            id: `session-${session._id}`,
            type: 'session',
            message: `Training session "${session.focusArea}" conducted with ${session.attendanceCount}/${session.totalPlayers} players attended`,
            timestamp: session.date,
            icon: 'calendar'
          });
        });
      }
    } catch (sessionError) {
      console.warn('Failed to load session activities:', sessionError);
    }
    
    // Sort by timestamp descending (most recent first)
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ activity: activity.slice(0, 10) }); // Return last 10 activities
  } catch (error) {
    console.error('Error fetching club activity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user's club details (manager can request changes)
const clubUpdateSchema = Joi.object({
  clubName: Joi.string().min(3).optional(),
  district: Joi.string().optional(),
  city: Joi.string().optional(),
  foundedYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
  managerName: Joi.string().optional(),
  phone: Joi.string().optional(),
  email: Joi.string().email().optional(),
  description: Joi.string().allow('').optional(),
  groundName: Joi.string().allow('').optional(),
  memberCount: Joi.number().integer().min(1).optional(),
  website: Joi.string().uri().allow('').optional(),
  achievements: Joi.string().allow('').optional(),
  // Accept http/https and data URLs, or allow null/empty for existing logos
  logoUrl: Joi.string().uri({ scheme: [/https?/, 'data'] }).allow('', null).optional(),
  bannerUrl: Joi.string().uri({ scheme: [/https?/, 'data'] }).allow('', null).optional()
});

router.put('/my-club', verifyFirebaseToken, requireRole('clubManager'), upload.fields([
  { name: 'logo', maxCount: 1 }
]), async (req, res) => {
  try {
    // Remove logoUrl from validation if it's an existing path (starts with /api/)
    const bodyToValidate = { ...req.body };
    if (bodyToValidate.logoUrl && bodyToValidate.logoUrl.startsWith('/api/')) {
      delete bodyToValidate.logoUrl;
    }
    
    const { value, error } = clubUpdateSchema.validate(bodyToValidate);
    if (error) return res.status(400).json({ message: error.details?.[0]?.message || 'Invalid input' });

    const club = await Club.findOne({ manager: req.user._id });
    if (!club) return res.status(404).json({ message: 'No club found' });

    // Apply updates (excluding logoUrl from value to prevent overwriting)
    Object.keys(value).forEach(key => {
      if (key !== 'logoUrl' && key !== 'bannerUrl') {
        club[key] = value[key];
      }
    });

    // Handle uploaded files
    const logoFile = req.files?.logo?.[0];
    if (logoFile) {
      club.logo = { data: logoFile.buffer, contentType: logoFile.mimetype };
      club.logoUrl = `/api/clubs/${club._id}/logo`;
    }

    // If club is approved or rejected, mark back to pending for re-approval when details change
    if (club.status !== 'pending') {
      club.status = 'pending';
      club.processedAt = null;
      club.processedBy = null;
      club.rejectionReason = undefined;
    }

    await club.save();
    res.json({ message: 'Club updated and sent for re-approval', club });
  } catch (err) {
    console.error('Error updating club:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Legacy club manager creates/updates club (keeping for backward compatibility)
const legacyClubSchema = Joi.object({ 
  name: Joi.string().min(3).required(), 
  logoUrl: Joi.string().uri().allow(''), 
  district: Joi.string().allow('') 
});

router.post('/', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  const { value, error } = legacyClubSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  let club = await Club.findOne({ manager: req.user._id });
  if (!club) {
    club = await Club.create({ ...value, manager: req.user._id });
  } else {
    club.name = value.name; club.logoUrl = value.logoUrl; club.district = value.district; club.status = 'pending';
    await club.save();
  }
  res.json({ message: 'Club submitted for approval', club });
});

// Admin approval
router.put('/:id/approve', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(
      req.params.id, 
      { 
        status: 'approved',
        processedAt: new Date(),
        processedBy: req.user._id
      }, 
      { new: true }
    );
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    res.json({ message: 'Club approved successfully', club });
  } catch (error) {
    console.error('Error approving club:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin rejection
router.put('/:id/reject', verifyFirebaseToken, requireRole('admin'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const club = await Club.findByIdAndUpdate(
      req.params.id, 
      { 
        status: 'rejected',
        rejectionReason: reason,
        processedAt: new Date(),
        processedBy: req.user._id
      }, 
      { new: true }
    );
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    
    res.json({ message: 'Club rejected successfully', club });
  } catch (error) {
    console.error('Error rejecting club:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve club logo binary
router.get('/:id/logo', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).select('logo');
    if (!club || !club.logo || !club.logo.data) return res.status(404).end();
    res.set('Content-Type', club.logo.contentType || 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(club.logo.data);
  } catch (err) {
    return res.status(404).end();
  }
});

// Serve club proof document
router.get('/:id/proof', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).select('proof');
    if (!club || !club.proof || !club.proof.data) return res.status(404).end();
    res.set('Content-Type', club.proof.contentType || 'application/pdf');
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(club.proof.data);
  } catch (err) {
    return res.status(404).end();
  }
});

// Note: banner endpoints removed as we only keep club icons (logos).

// Public fetches approved clubs
router.get('/public', async (req, res) => {
  try {
    const clubs = await Club.find({ status: 'approved' })
      .select('clubName name logoUrl district city description memberCount groundName foundedYear')
      .sort({ clubName: 1 });

    // Normalize shape for frontend and ensure stable image URLs
    const mapped = clubs.map(c => ({
      id: c._id,
      name: c.clubName || c.name,
      district: c.district,
      city: c.city,
      description: c.description,
      memberCount: c.memberCount,
      groundName: c.groundName,
      foundedYear: c.foundedYear,
      // Always provide stable endpoints; frontend hides image on 404
      logoUrl: c.logoUrl || `/api/clubs/${c._id}/logo`,
    }));

    res.json(mapped);
  } catch (error) {
    console.error('Error fetching public clubs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get players for a specific club (public endpoint) - MUST come before /public/:id
router.get('/public/:id/players', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club || club.status !== 'approved') {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Import Player model
    const Player = (await import('../models/Player.js')).default;
    
    // Find all players who are currently members of this club
    const players = await Player.find({ 
      currentClub: club._id,
      isActive: true 
    })
    .populate('user', 'name email')
    .select('fullName age preferredPosition playingExperience battingStyle bowlingStyle joinedClubAt statistics profilePhoto')
    .sort({ joinedClubAt: -1 }); // Most recent first

    // Format player data for public display
    const formattedPlayers = players.map(player => ({
      id: player._id,
      fullName: player.fullName,
      age: player.age,
      preferredPosition: player.preferredPosition,
      playingExperience: player.playingExperience,
      battingStyle: player.battingStyle,
      bowlingStyle: player.bowlingStyle,
      joinedAt: player.joinedClubAt,
      statistics: {
        matchesPlayed: player.statistics?.matchesPlayed || 0,
        runsScored: player.statistics?.runsScored || 0,
        wicketsTaken: player.statistics?.wicketsTaken || 0,
        catches: player.statistics?.catches || 0,
        stumpings: player.statistics?.stumpings || 0
      },
      hasProfilePhoto: !!(player.profilePhoto && player.profilePhoto.data)
    }));

    res.json({ 
      club: {
        id: club._id,
        name: club.clubName || club.name,
        district: club.district,
        city: club.city
      },
      players: formattedPlayers,
      totalPlayers: formattedPlayers.length
    });
  } catch (error) {
    console.error('Error fetching club players:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get coaches for a specific club (public endpoint)
router.get('/public/:id/coaches', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club || club.status !== 'approved') {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Import Coach model
    const Coach = (await import('../models/Coach.js')).default;
    
    // Find all coaches who are currently members of this club
    const coaches = await Coach.find({ 
      currentClub: club._id
    })
    .populate('user', 'name email')
    .select('fullName age coachingExperience specializations coachingHistory joinedClubAt profilePhoto')
    .sort({ joinedClubAt: -1 }); // Most recent first

    // Format coach data for public display
    const formattedCoaches = coaches.map(coach => ({
      id: coach._id,
      fullName: coach.fullName,
      age: coach.age,
      coachingExperience: coach.coachingExperience,
      specializations: coach.specializations,
      coachingHistory: coach.coachingHistory,
      joinedAt: coach.joinedClubAt,
      hasProfilePhoto: !!(coach.profilePhoto && coach.profilePhoto.data)
    }));

    res.json({ 
      club: {
        id: club._id,
        name: club.clubName || club.name,
        district: club.district,
        city: club.city
      },
      coaches: formattedCoaches,
      totalCoaches: formattedCoaches.length
    });
  } catch (error) {
    console.error('Error fetching club coaches:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Public fetch of a single club by id
router.get('/public/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club || club.status !== 'approved') {
      return res.status(404).json({ message: 'Club not found' });
    }
    const payload = {
      id: club._id,
      name: club.clubName || club.name,
      district: club.district,
      city: club.city,
      description: club.description,
      memberCount: club.memberCount,
      groundName: club.groundName,
      website: club.website,
      achievements: club.achievements,
      foundedYear: club.foundedYear,
      email: club.email,
      phone: club.phone,
      // Always provide stable endpoints; frontend hides image on 404
      logoUrl: club.logoUrl || `/api/clubs/${club._id}/logo`,
    };
    res.json(payload);
  } catch (error) {
    console.error('Error fetching public club details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/clubs/remove-player/:playerId - Remove a player from the club
router.delete('/remove-player/:playerId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the player
    const player = await Player.findById(req.params.playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Check if this player is associated with this club
    if (player.currentClub && player.currentClub.toString() === club._id.toString()) {
      // Remove the player from the club
      player.currentClub = null;
      player.joinedClubAt = null;
      
      // Also update any approved applications to rejected status
      player.applications.forEach(app => {
        if (app.club.toString() === club._id.toString() && app.status === 'approved') {
          app.status = 'rejected';
          app.processedAt = new Date();
          app.rejectionReason = 'Removed from club by manager';
        }
      });
      
      await player.save();
      
      return res.json({ message: 'Player removed from club successfully' });
    } else {
      return res.status(400).json({ message: 'This player is not associated with your club' });
    }
  } catch (error) {
    console.error('Error removing player from club:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/clubs/remove-coach/:coachId - Remove a coach from the club
router.delete('/remove-coach/:coachId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { removalReason } = req.body;
    
    // Validate removal reason
    if (!removalReason || removalReason.trim().length < 10) {
      return res.status(400).json({ message: 'Removal reason must be at least 10 characters long' });
    }
    
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }

    // Find the coach
    const coach = await Coach.findById(req.params.coachId);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    // Check if this coach is associated with this club
    if (coach.currentClub && coach.currentClub.toString() === club._id.toString()) {
      // Remove the coach from the club
      coach.currentClub = null;
      coach.joinedClubAt = null;
      
      // Also update any approved applications to rejected status
      coach.applications.forEach(app => {
        if (app.club.toString() === club._id.toString() && app.status === 'approved') {
          app.status = 'rejected';
          app.processedAt = new Date();
          app.rejectionReason = removalReason.trim();
        }
      });
      
      // Add to resign history if it doesn't exist
      if (!coach.resignHistory) {
        coach.resignHistory = [];
      }
      
      // Add removal record to resign history
      coach.resignHistory.push({
        club: club._id,
        resignedAt: new Date(),
        reason: removalReason.trim()
      });
      
      await coach.save();
      
      return res.json({ message: 'Coach removed from club successfully' });
    } else {
      return res.status(400).json({ message: 'This coach is not associated with your club' });
    }
  } catch (error) {
    console.error('Error removing coach from club:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/clubs/remove-player/:playerId - Remove a player from the club
router.delete('/remove-player/:playerId', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const { playerId } = req.params;
    
    // Find the club managed by this user
    const club = await Club.findOne({ manager: req.user._id });
    if (!club) {
      return res.status(404).json({ message: 'No club found for this manager' });
    }
    
    // Find the player
    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    
    // Check if the player is in this club
    if (player.currentClub && player.currentClub.toString() === club._id.toString()) {
      // Remove player from club
      player.currentClub = null;
      player.joinedClubAt = null;
      
      await player.save();
      
      return res.json({ message: 'Player removed from club successfully' });
    } else {
      return res.status(400).json({ message: 'This player is not associated with your club' });
    }
  } catch (error) {
    console.error('Error removing player from club:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;