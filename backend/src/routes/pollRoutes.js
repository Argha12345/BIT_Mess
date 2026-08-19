import express from 'express';
import { 
  createPoll, 
  getPolls, 
  votePoll, 
  closePoll, 
  resolveTie, 
  deletePoll 
} from '../controllers/pollController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPolls);
router.post('/', authenticateToken, authorizeRoles('admin'), createPoll);
router.post('/:id/vote', authenticateToken, votePoll);
router.put('/:id/close', authenticateToken, authorizeRoles('admin'), closePoll);
router.put('/:id/resolve', authenticateToken, authorizeRoles('admin'), resolveTie);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deletePoll);

export default router;

