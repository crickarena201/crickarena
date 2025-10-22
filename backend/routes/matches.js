import express from 'express';
import Match from '../models/Match.js';
import Coach from '../models/Coach.js';
import Player from '../models/Player.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { body, validationResult, param } from 'express-validator';

const router = express.Router();

// Validation middleware for roster submission
const validateRoster = [
  param('matchId').isMongoId().withMessage('Valid match ID is required'),
  body('players').isArray({ min: 11, max: 11 }).withMessage('Exactly 11 players must be selected'),
  body('players.*.playerId').isMongoId().withMessage('Valid player ID is required'),
  body('players.*.playerName').trim().isLength({ min: 1 }).withMessage('Player name is required'),
  body('players.*.position').trim().isLength({ min: 1 }).withMessage('Player position is required'),
  body('players.*.jerseyNumber').optional({ nullable: true }).isInt({ min: 0, max: 99 }).withMessage('Jersey number must be between 0-99')
];

// POST /api/matches/:matchId/roster - Submit roster for a match
router.post('/:matchId/roster', verifyFirebaseToken, validateRoster, async (req, res) => {
  try {
    console.log('Roster submission request:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { matchId } = req.params;
    const { players } = req.body;

    // Get coach profile
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    // Get match details
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if match is upcoming (can only set roster for upcoming matches)
    if (match.status !== 'Scheduled') {
      return res.status(400).json({ message: 'Can only set roster for scheduled matches' });
    }

    // Check if coach's club is participating in this match
    const coachClubId = coach.currentClub._id.toString();
    const isHomeTeam = match.homeClub.toString() === coachClubId;
    const isAwayTeam = match.awayClub.toString() === coachClubId;

    if (!isHomeTeam && !isAwayTeam) {
      return res.status(403).json({ message: 'You can only set roster for your own club\'s matches' });
    }

    // Verify all players belong to the coach's club
    const playerIds = players.map(p => p.playerId);
    const clubPlayers = await Player.find({
      _id: { $in: playerIds },
      currentClub: coach.currentClub._id,
      isActive: true
    });

    if (clubPlayers.length !== players.length) {
      return res.status(400).json({ message: 'All selected players must be active members of your club' });
    }

    // Check for duplicate jersey numbers
    const jerseyNumbers = players.filter(p => p.jerseyNumber).map(p => p.jerseyNumber);
    const uniqueJerseyNumbers = [...new Set(jerseyNumbers)];
    if (jerseyNumbers.length !== uniqueJerseyNumbers.length) {
      return res.status(400).json({ message: 'Jersey numbers must be unique' });
    }

    // Create roster object
    const roster = {
      players: players.map(player => ({
        playerId: player.playerId,
        playerName: player.playerName,
        position: player.position,
        jerseyNumber: player.jerseyNumber || null
      })),
      submittedBy: coach._id,
      submittedAt: new Date()
    };

    // Update the appropriate roster field
    if (isHomeTeam) {
      match.homeClubRoster = roster;
    } else {
      match.awayClubRoster = roster;
    }

    await match.save();

    res.json({ 
      message: 'Roster submitted successfully',
      roster: roster,
      teamType: isHomeTeam ? 'home' : 'away'
    });

  } catch (error) {
    console.error('Error submitting roster:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/matches/:matchId/roster - Get roster for a match
router.get('/:matchId/roster', async (req, res) => {
  try {
    const { matchId } = req.params;

    const match = await Match.findById(matchId)
      .populate('homeClub', 'name clubName logoUrl')
      .populate('awayClub', 'name clubName logoUrl')
      .populate('homeClubRoster.submittedBy', 'fullName')
      .populate('awayClubRoster.submittedBy', 'fullName')
      .select('homeClub awayClub homeClubRoster awayClubRoster status');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const response = {
      matchId: match._id,
      status: match.status,
      homeTeam: {
        club: {
          _id: match.homeClub._id,
          name: match.homeClub.clubName || match.homeClub.name,
          logoUrl: match.homeClub.logoUrl
        },
        roster: match.homeClubRoster || null
      },
      awayTeam: {
        club: {
          _id: match.awayClub._id,
          name: match.awayClub.clubName || match.awayClub.name,
          logoUrl: match.awayClub.logoUrl
        },
        roster: match.awayClubRoster || null
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching roster:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/matches/:matchId/roster/my-team - Get roster status for coach's team
router.get('/:matchId/roster/my-team', verifyFirebaseToken, async (req, res) => {
  try {
    const { matchId } = req.params;

    // Get coach profile
    const coach = await Coach.findOne({ user: req.user._id }).populate('currentClub');
    if (!coach) {
      return res.status(404).json({ message: 'Coach profile not found' });
    }

    if (!coach.currentClub) {
      return res.status(400).json({ message: 'Coach is not associated with any club' });
    }

    const match = await Match.findById(matchId)
      .populate('homeClub', 'name clubName')
      .populate('awayClub', 'name clubName')
      .select('homeClub awayClub homeClubRoster awayClubRoster status');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Check if coach's club is participating in this match
    const coachClubId = coach.currentClub._id.toString();
    const isHomeTeam = match.homeClub._id.toString() === coachClubId;
    const isAwayTeam = match.awayClub._id.toString() === coachClubId;

    if (!isHomeTeam && !isAwayTeam) {
      return res.status(403).json({ message: 'You can only view roster for your own club\'s matches' });
    }

    const teamRoster = isHomeTeam ? match.homeClubRoster : match.awayClubRoster;

    res.json({
      matchId: match._id,
      matchStatus: match.status,
      teamType: isHomeTeam ? 'home' : 'away',
      hasRoster: !!teamRoster,
      roster: teamRoster || null,
      canSubmitRoster: match.status === 'Scheduled'
    });

  } catch (error) {
    console.error('Error fetching team roster status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
