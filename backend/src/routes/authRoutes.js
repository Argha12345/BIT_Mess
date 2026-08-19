import express from 'express';
import { login, googleLogin, register, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/register', register);
router.post('/change-password', authenticateToken, changePassword);

export default router;
