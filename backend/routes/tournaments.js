import express from 'express';
import Joi from 'joi';
import Tournament from '../models/Tournament.js';
import Match from '../models/Match.js';
import Club from '../models/Club.js';
import { verifyFirebaseToken } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Public/club-facing listings
router.get('/open', async (req, res) => {
  try {
    const list = await Tournament.find({ status: 'open' }).sort({ startDate: 1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching open tournaments:', error);
    res.status(500).json({ message: 'Failed to fetch open tournaments' });
  }
});

router.get('/mine', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const myClub = await Club.findOne({ manager: req.user._id });
    if (!myClub) return res.json([]);
    const list = await Tournament.find({ 'registrations.club': myClub._id })
      .select('name bannerUrl format startDate endDate district registrationDeadline registrations status')
      .lean();
    // Attach my registration status
    const mapped = list.map(t => {
      const reg = (t.registrations || []).find(r => String(r.club) === String(myClub._id));
      return { ...t, myRegistrationStatus: reg?.status || 'pending' };
    });
    res.json(mapped);
  } catch (error) {
    console.error('Error fetching my tournaments:', error);
    res.status(500).json({ message: 'Failed to fetch my tournaments' });
  }
});

// Registration endpoint with strict validation
router.post('/:id/register', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  const fail = (msg) => {
    logger.warn('Tournament registration failed', { 
      userId: req.user._id, 
      tournamentId: req.params.id, 
      reason: msg 
    });
    return res.status(400).json({ error: msg });
  };
  
  try {
    logger.info('Tournament registration attempt', { 
      userId: req.user._id, 
      tournamentId: req.params.id 
    });
    const t = await Tournament.findById(req.params.id).lean();
    if (!t) return res.status(404).json({ error: 'Tournament not found.' });

    // 2) Tournament status must be Open and fixtures not generated
    if (t.status !== 'open' || t.fixturesGenerated) return fail('Registration not available.');

    // 3) Current date <= registrationDeadline (if set)
    if (t.registrationDeadline && new Date(t.registrationDeadline) < new Date()) {
      return fail('Registration closed.');
    }

    // 1) Club must be approved by admin
    const myClub = await Club.findOne({ manager: req.user._id });
    if (!myClub) return fail('No club found for this user.');
    if (myClub.status !== 'approved') return fail('Club not approved.');

    // 5) No duplicate registration
    const regs = Array.isArray(t.registrations) ? t.registrations : [];
    const myReg = regs.find(r => String(r.club) === String(myClub._id));
    if (myReg) return fail('Already registered.');

    // 6) Previously rejected? Allow re-registration after 24 hours with admin approval
    const rejectedReg = regs.find(r => String(r.club) === String(myClub._id) && r.status === 'rejected');
    if (rejectedReg) {
      const rejectionTime = new Date(rejectedReg.rejectedAt || rejectedReg.appliedAt);
      const hoursSinceRejection = (Date.now() - rejectionTime.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceRejection < 24) {
        return fail('Registration was rejected. Please wait 24 hours before re-applying.');
      }
      
      // Allow re-registration but mark it for admin review
      console.log(`Club ${myClub._id} re-applying after rejection. Flagging for admin review.`);
    }

    // 4) Capacity check with atomic operation to prevent race conditions
    const updateResult = await Tournament.updateOne(
      { 
        _id: t._id,
        $expr: {
          $lt: [
            { $size: { $filter: { 
              input: '$registrations', 
              cond: { $in: ['$$this.status', ['pending', 'approved']] }
            }}},
            '$maxTeams'
          ]
        },
        'registrations.club': { $ne: myClub._id } // Ensure no duplicate
      },
      { $push: { registrations: { club: myClub._id, status: 'pending', appliedAt: new Date() } } }
    );

    if (updateResult.matchedCount === 0) {
      // Either tournament is full or club already registered
      const updatedT = await Tournament.findById(t._id).lean();
      const currentRegs = Array.isArray(updatedT.registrations) ? updatedT.registrations : [];
      const taken = currentRegs.filter(r => ['pending', 'approved'].includes(r.status)).length;
      
      if (taken >= t.maxTeams) {
        return fail('Tournament is full.');
      }
      
      const existingReg = currentRegs.find(r => String(r.club) === String(myClub._id));
      if (existingReg) {
        return fail('Already registered.');
      }
      
      return fail('Registration failed. Please try again.');
    }

    logger.info('Tournament registration successful', { 
      userId: req.user._id, 
      clubId: myClub._id,
      tournamentId: t._id,
      tournamentName: t.name
    });
    
    return res.json({ message: 'Registered successfully', tournamentId: t._id });
  } catch (error) {
    logger.error('Tournament registration error', { 
      userId: req.user._id, 
      tournamentId: req.params.id, 
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'Failed to register.' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const list = await Tournament.find({ 
      status: { $in: ['upcoming', 'ongoing'] } 
    })
    .populate('organizer', 'name email')
    .sort({ startDate: 1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching upcoming tournaments:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming tournaments' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const list = await Tournament.find({ 
      status: 'completed' 
    })
    .populate('organizer', 'name email')
    .sort({ endDate: -1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching tournament history:', error);
    res.status(500).json({ message: 'Failed to fetch tournament history' });
  }
});

// Get single tournament
// Public: list tournaments for all users (optional status filter)
router.get('/list', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status; // 'open' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
    const list = await Tournament.find(filter)
      .select('name bannerUrl format startDate endDate district status registrationDeadline')
      .populate('organizer', 'name email')
      .sort({ startDate: 1 });
    res.json(list);
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    res.status(500).json({ message: 'Failed to fetch tournaments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizer', 'name email')
      .populate('participants', 'clubName name logoUrl district')
      .populate('registrations.club', 'clubName name logoUrl district');
    
    if (!tournament) {
      return res.status(404).json({ message: 'Tournament not found' });
    }
    
    res.json(tournament);
  } catch (error) {
    console.error('Error fetching tournament:', error);
    res.status(500).json({ message: 'Failed to fetch tournament' });
  }
});

// Basic matches endpoint (for later expansion)
router.get('/:id/matches', async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.id })
      .populate('homeClub', 'clubName name logoUrl district')
      .populate('awayClub', 'clubName name logoUrl district')
      .lean();
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
});

// Get specific match by ID within a tournament
router.get('/:id/matches/:matchId', async (req, res) => {
  try {
    const match = await Match.findOne({ 
      _id: req.params.matchId, 
      tournament: req.params.id 
    })
      .populate('homeClub', 'clubName name logoUrl district')
      .populate('awayClub', 'clubName name logoUrl district')
      .populate('tournament', 'name bannerUrl district startDate endDate format status')
      .lean();
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ message: 'Failed to fetch match' });
  }
});

// Matches for the logged-in club manager in a tournament
router.get('/:id/matches/mine', verifyFirebaseToken, requireRole('clubManager'), async (req, res) => {
  try {
    const myClub = await Club.findOne({ manager: req.user._id });
    if (!myClub) return res.json([]);
    const matches = await Match.find({ tournament: req.params.id, $or: [{ homeClub: myClub._id }, { awayClub: myClub._id }] })
      .populate('homeClub awayClub');
    res.json(matches);
  } catch (error) {
    console.error('Error fetching my matches:', error);
    res.status(500).json({ message: 'Failed to fetch my matches' });
  }
});

// Public standings with tie-breakers (points -> NRR -> head-to-head)
router.get('/:id/standings', async (req, res) => {
  try {
    const t = await Tournament.findById(req.params.id).lean();
    if (!t) return res.status(404).json({ message: 'Tournament not found' });
    let rows = Array.isArray(t.standings) ? [...t.standings] : [];

    const headToHead = async (aClub, bClub) => {
      const h2h = await Match.find({
        tournament: req.params.id,
        $or: [
          { homeClub: aClub, awayClub: bClub },
          { homeClub: bClub, awayClub: aClub }
        ],
        status: 'Completed'
      }).lean();
      let aWins = 0, bWins = 0;
      h2h.forEach(m => {
        if (String(m.result?.winner) === String(aClub)) aWins++;
        if (String(m.result?.winner) === String(bClub)) bWins++;
      });
      return aWins === bWins ? 0 : (aWins > bWins ? -1 : 1);
    };

    const group = (req.query.group || '').toString();
    if (group) rows = rows.filter(r => r.group === group);

    // Sort with async H2H for 2-way ties
    rows.sort((a, b) => (b.points - a.points) || (b.nrr - a.nrr));

    // Resolve 2-way ties via head-to-head
    const finalizeOrder = async (arr) => {
      for (let i = 0; i < arr.length - 1; i++) {
        const a = arr[i], b = arr[i + 1];
        if (a.points === b.points && a.nrr === b.nrr) {
          const cmp = await headToHead(a.club, b.club);
          if (cmp > 0) {
            const tmp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = tmp;
          }
        }
      }
      return arr;
    };

    const sorted = await finalizeOrder(rows);
    res.json(sorted);
  } catch (error) {
    console.error('Error fetching standings:', error);
    res.status(500).json({ message: 'Failed to fetch standings' });
  }
});

// Public bracket view (group matches by knockout round)
router.get('/:id/bracket', async (req, res) => {
  try {
    const matches = await Match.find({ tournament: req.params.id, stage: 'Knockout' })
      .sort({ bracketRound: 1, bracketSlot: 1 })
      .populate('homeClub awayClub');
    const rounds = {};
    for (const m of matches) {
      const key = m.round || `Round ${m.bracketRound || 0}`;
      if (!rounds[key]) rounds[key] = [];
      rounds[key].push(m);
    }
    res.json(rounds);
  } catch (error) {
    console.error('Error fetching bracket:', error);
    res.status(500).json({ message: 'Failed to fetch bracket' });
  }
});

// Upcoming fixtures across tournaments (for home page)
router.get('/matches/upcoming', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const upcomingTs = await Tournament.find({ status: { $in: ['upcoming', 'ongoing'] } })
      .select('_id name bannerUrl district startDate endDate format status')
      .sort({ startDate: 1 })
      .lean();
    const tIds = upcomingTs.map(t => t._id);
    if (!tIds.length) return res.json([]);

    const matches = await Match.find({ tournament: { $in: tIds } })
      .populate('homeClub', 'clubName name logoUrl district')
      .populate('awayClub', 'clubName name logoUrl district')
      .sort({ date: 1 })
      .limit(limit)
      .lean();

    // attach lightweight tournament info
    const tMap = new Map(upcomingTs.map(t => [String(t._id), t]));
    const payload = matches.map(m => ({
      _id: m._id,
      date: m.date,
      time: m.time,
      venue: m.venue,
      homeClub: m.homeClub,
      awayClub: m.awayClub,
      tournament: tMap.get(String(m.tournament))
    }));

    res.json(payload);
  } catch (error) {
    console.error('Error fetching upcoming fixtures:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming fixtures' });
  }
});

// Live matches across tournaments (for home page)
router.get('/matches/live', async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const liveMatches = await Match.find({ status: 'Live' })
      .populate('homeClub', 'clubName name logoUrl district')
      .populate('awayClub', 'clubName name logoUrl district')
      .populate('tournament', 'name bannerUrl district startDate endDate format status')
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    res.json(liveMatches);
  } catch (error) {
    console.error('Error fetching live matches:', error);
    res.status(500).json({ message: 'Failed to fetch live matches' });
  }
});

export default router;