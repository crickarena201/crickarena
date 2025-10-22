import mongoose from 'mongoose';

// Store balls as integer (e.g., 10 overs 3 balls => 63 balls) for precise NRR/economy
const Balls = { type: Number, min: 0, default: 0 };

const dismissalSchema = new mongoose.Schema({
  how: { type: String, default: '' }, // e.g., b, lbw, c, run out
  bowler: { type: String, default: '' }, // bowler name
  fielder: { type: String, default: '' } // fielder name(s)
}, { _id: false });

const battingEntrySchema = new mongoose.Schema({
  playerName: { type: String, required: true },
  runs: { type: Number, min: 0, default: 0 },
  balls: Balls,
  fours: { type: Number, min: 0, default: 0 },
  sixes: { type: Number, min: 0, default: 0 },
  strikeRate: { type: Number, min: 0, default: 0 }, // auto-calculated
  dismissal: dismissalSchema
}, { _id: false });

const bowlingEntrySchema = new mongoose.Schema({
  bowlerName: { type: String, required: true },
  balls: Balls, // total balls bowled
  maidens: { type: Number, min: 0, default: 0 },
  runs: { type: Number, min: 0, default: 0 },
  wickets: { type: Number, min: 0, default: 0 },
  economy: { type: Number, min: 0, default: 0 } // auto-calculated (runs / (balls/6))
}, { _id: false });

const extrasSchema = new mongoose.Schema({
  wides: { type: Number, min: 0, default: 0 },
  noBalls: { type: Number, min: 0, default: 0 },
  byes: { type: Number, min: 0, default: 0 },
  legByes: { type: Number, min: 0, default: 0 },
  penalty: { type: Number, min: 0, default: 0 },
  total: { type: Number, min: 0, default: 0 }
}, { _id: false });

const fowSchema = new mongoose.Schema({
  score: { type: Number, min: 0, default: 0 },
  over: { type: String, default: '' }, // e.g., 12.3
  batsman: { type: String, default: '' }
}, { _id: false });

const ballSchema = new mongoose.Schema({
  overNumber: { type: Number, min: 1, required: true },
  ballNumber: { type: Number, min: 1, max: 6, required: true },
  runs: { type: Number, min: 0, max: 6, default: 0 },
  extras: { 
    type: String, 
    enum: ['none', 'wide', 'no-ball', 'bye', 'leg-bye'], 
    default: 'none' 
  },
  wicket: {
    batsman: { type: String, default: '' },
    how: { type: String, default: '' }, // bowled, lbw, caught, run out, stumped, hit wicket, retired hurt
    fielder: { type: String, default: '' },
    bowler: { type: String, default: '' }
  },
  batsman: { type: String, required: true },
  bowler: { type: String, required: true },
  likes: { type: Number, min: 0, default: 0 }
}, { _id: false });

const overSchema = new mongoose.Schema({
  overNumber: { type: Number, min: 1, required: true },
  bowler: { type: String, required: true },
  balls: [ballSchema],
  totalRuns: { type: Number, min: 0, default: 0 },
  totalWickets: { type: Number, min: 0, default: 0 },
  totalExtras: { type: Number, min: 0, default: 0 }
}, { _id: false });

const inningsSchema = new mongoose.Schema({
  battingClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  bowlingClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  runs: { type: Number, min: 0, default: 0 },
  wickets: { type: Number, min: 0, default: 0 },
  balls: Balls, // balls faced
  battingCard: [battingEntrySchema],
  bowlingCard: [bowlingEntrySchema],
  extras: extrasSchema,
  fallOfWickets: [fowSchema],
  // Ball-by-ball data
  overs: [overSchema],
  currentOver: { type: Number, min: 1, default: 1 },
  currentBall: { type: Number, min: 1, max: 6, default: 1 }
}, { _id: false });

const editHistorySchema = new mongoose.Schema({
  at: { type: Date, default: Date.now },
  by: { type: String, default: '' },
  changes: { type: Object, default: {} }
}, { _id: false });

// Schema for team roster/lineup
const rosterSchema = new mongoose.Schema({
  players: [{
    playerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Player', required: true },
    playerName: { type: String, required: true },
    position: { type: String, required: true },
    jerseyNumber: { type: Number }
  }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Coach', required: true },
  submittedAt: { type: Date, default: Date.now }
}, { _id: false });

const matchSchema = new mongoose.Schema({
  tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
  homeClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  awayClub: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  // Scheduling
  date: Date, // Calendar date
  time: String, // e.g., '09:00'
  venue: String,
  // Meta
  matchCode: { type: String, default: '' }, // human-friendly ID within a tournament (e.g., T-001)
  round: { type: String, default: '' }, // e.g., 'Group', 'Quarterfinal', 'Semifinal', 'Final'
  stage: { type: String, enum: ['Group', 'Knockout', 'Playoff', 'Final', ''], default: '' },
  group: { type: String, default: '' },
  matchType: { type: String, enum: ['League', 'Knockout', 'Final', ''], default: '' },
  matchFormat: { type: String, enum: ['T20', 'T10', 'ODI', 'Test'], default: 'T20' },
  oversLimit: { type: Number, default: 20, min: 5, max: 50 },
  status: { type: String, enum: ['Scheduled', 'Live', 'Completed', 'Cancelled'], default: 'Scheduled' },
  finalized: { type: Boolean, default: false },
  // Toss and innings
  toss: {
    wonBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    decision: { type: String, enum: ['bat', 'bowl', ''], default: '' }
  },
  inningsOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  innings: [inningsSchema], // usually 2 entries
  // Summary/Highlights
  summary: {
    topScorer: { type: String, default: '' },
    topWicketTaker: { type: String, default: '' },
    bestContribution: { type: String, default: '' },
    playerOfTheMatch: { type: String, default: '' }
  },
  // Result details
  result: {
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
    isTie: { type: Boolean, default: false },
    isNoResult: { type: Boolean, default: false },
    margin: {
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 }
    },
    summary: String
  },
  // Team rosters/lineups
  homeClubRoster: rosterSchema,
  awayClubRoster: rosterSchema,
  // Manual edit history
  editHistory: [editHistorySchema]
}, { timestamps: true });

export default mongoose.model('Match', matchSchema);