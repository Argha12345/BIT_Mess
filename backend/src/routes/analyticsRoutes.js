import express from 'express';
import { getLiveStatus, getWasteAnalytics, getQueuePredictions } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow public access to live status for public display, require auth for waste and queue analytics
router.get('/live', getLiveStatus);
router.get('/waste', authenticateToken, getWasteAnalytics);
router.get('/queue', authenticateToken, getQueuePredictions);

export default router;

