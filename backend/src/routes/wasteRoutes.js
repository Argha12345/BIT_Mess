import express from 'express';
import { getWasteLogs, logDailyWaste, submitFeedback, getFeedbacks, deleteFeedback, getPortionRecommendation } from '../controllers/wasteController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/logs', authenticateToken, getWasteLogs);
router.post('/log', authenticateToken, authorizeRoles('admin'), logDailyWaste);
router.post('/feedback', authenticateToken, submitFeedback);
router.get('/feedbacks', authenticateToken, getFeedbacks);
router.delete('/feedback/:id', authenticateToken, authorizeRoles('admin'), deleteFeedback);
router.get('/recommendation', authenticateToken, getPortionRecommendation);

export default router;

