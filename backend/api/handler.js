import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import all routes
const { default: authRoutes } = await import('../routes/auth.js');
const { default: clubRoutes } = await import('../routes/clubs.js');
const { default: tournamentRoutes } = await import('../routes/tournaments.js');
const { default: adminRoutes } = await import('../routes/admin.js');
const { default: userRoutes } = await import('../routes/users.js');
const { default: paymentsRoutes } = await import('../routes/payments.js');
const { default: playerRoutes } = await import('../routes/players.js');
const { default: coachRoutes } = await import('../routes/coaches.js');
const { default: messageRoutes } = await import('../routes/messages.js');
const { default: matchRoutes } = await import('../routes/matches.js');
const { errorHandler } = await import('../utils/logger.js');

// Create a new Express app specifically for Vercel
const app = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Routes
app.get('/health', (_, res) => res.json({ ok: true }));

// Add a root route that explains this is an API server
app.get('/', (req, res) => {
  res.json({ 
    message: 'CrickArena API Server', 
    version: '1.0.0',
    documentation: 'Please refer to the API documentation for available endpoints',
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/matches', matchRoutes);

// Error handling
app.use(errorHandler);

// Export the app
export default app;