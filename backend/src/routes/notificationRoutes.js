import express from 'express';
import { getNotifications, sendNotification, deleteNotification } from '../controllers/notificationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.post('/', authenticateToken, authorizeRoles('admin'), sendNotification);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteNotification);

export default router;
