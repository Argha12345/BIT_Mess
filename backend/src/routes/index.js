import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import authRoutes from './authRoutes.js';
import menuRoutes from './menuRoutes.js';
import wasteRoutes from './wasteRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import pollRoutes from './pollRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();

const isDev = process.env.NODE_ENV !== 'production';

// Rate Limiting for Auth Endpoints (Brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login/registration attempts. Please try again after 15 minutes.' }
});

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 5000 : 300,
  standardHeaders: true,
  legacyHeaders: false
});

// Mount Routes
router.use('/', apiLimiter);
router.use('/auth', authLimiter, authRoutes);
router.use('/menu', menuRoutes);
router.use('/waste', wasteRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/polls', pollRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reservations', reservationRoutes);
router.use('/users', userRoutes);

export default router;
