import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import wasteRoutes from './routes/wasteRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import pollRoutes from './routes/pollRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { sanitizeInputMiddleware } from './middleware/validationMiddleware.js';

dotenv.config();

const app = express();

// Security HTTP Headers (Helmet)
app.use(helmet());

// CORS Configuration
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser agents or matching client origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy restriction: Origin not allowed.'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parsing & Sanitization
app.use(express.json({ limit: '10kb' })); // Limit body payload to prevent DoS
app.use(sanitizeInputMiddleware);

// Rate Limiting for Auth Endpoints (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 auth attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login/registration attempts. Please try again after 15 minutes.' }
});

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bannari Amman Institute of Technology (BIT) Hostel Mess Foot-Traffic & Waste Reduction API',
    status: 'Operational',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (never expose raw stack trace in production)
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  console.error('Error occurred:', err.stack || err.message);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(isDev && { stack: err.stack })
  });
});

export default app;

