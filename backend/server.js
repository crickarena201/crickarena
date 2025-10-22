import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure we load the correct .env from the backend directory before loading modules that use env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { connectDB } from './config/db.js';

// Import routes AFTER dotenv so modules that need env (e.g., firebase) see it
const { default: authRoutes } = await import('./routes/auth.js');
const { default: clubRoutes } = await import('./routes/clubs.js');
const { default: tournamentRoutes } = await import('./routes/tournaments.js');
const { default: adminRoutes } = await import('./routes/admin.js');
const { default: userRoutes } = await import('./routes/users.js');
const { default: paymentsRoutes } = await import('./routes/payments.js');
const { default: playerRoutes } = await import('./routes/players.js');
const { default: coachRoutes } = await import('./routes/coaches.js');
const { default: messageRoutes } = await import('./routes/messages.js');
const { default: matchRoutes } = await import('./routes/matches.js');
const { errorHandler, logger } = await import('./utils/logger.js');

const app = express();

// CORS configuration with better security
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked request', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", 'https://checkout.razorpay.com', "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", 'https://api.razorpay.com'],
      frameSrc: ["'self'", 'https://checkout.razorpay.com']
    },
  },
}));

// Rate limiting - more generous limits for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased from 100 to 500 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for local development
    const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost');
    return process.env.NODE_ENV === 'development' && isLocalhost;
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // increased from 20 to 50 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  skip: (req) => {
    // Skip rate limiting for local development
    const isLocalhost = req.ip === '127.0.0.1' || req.ip === '::1' || req.ip.includes('localhost');
    return process.env.NODE_ENV === 'development' && isLocalhost;
  }
});

app.use(limiter);
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(cookieParser());

// Add request timeout middleware
app.use((req, res, next) => {
  // Set a timeout for each request
  req.setTimeout(30000, () => {
    console.warn(`Request timeout for ${req.method} ${req.url}`);
    if (!res.headersSent) {
      res.status(408).json({ message: 'Request timeout' });
    }
  });
  
  // Set response timeout
  res.setTimeout(30000, () => {
    console.warn(`Response timeout for ${req.method} ${req.url}`);
    if (!res.headersSent) {
      res.status(408).json({ message: 'Response timeout' });
    }
  });
  
  next();
});

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
// Mount admin routes BEFORE tournament routes to avoid conflicts
app.use('/api/admin', adminRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/matches', matchRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
await connectDB(process.env.MONGO_URI);

const server = app.listen(PORT, () => console.log(`API on :${PORT} (CORS: ${allowedOrigins.join(', ')})`));

// Configure server timeouts to prevent hanging requests
server.timeout = 60000; // 60 seconds timeout
server.keepAliveTimeout = 65000; // Keep alive timeout
server.headersTimeout = 66000; // Headers timeout

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Periodic status sync (every 60s)
try {
  const { syncTournamentAndMatches } = await import('./utils/statusSync.js');
  setInterval(() => {
    syncTournamentAndMatches().catch(() => {});
  }, 60 * 1000);
} catch (_) {}