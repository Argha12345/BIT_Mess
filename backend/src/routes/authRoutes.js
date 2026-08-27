import express from 'express';
import { login, googleLogin, register, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.post('/google-login', authLimiter, googleLogin);
router.post('/register', register);
router.post('/change-password', authenticateToken, changePassword);

export default router;
