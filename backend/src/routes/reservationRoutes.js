import express from 'express';
import { 
  createReservation, 
  getStudentReservations, 
  getReservations, 
  updateReservationStatus 
} from '../controllers/reservationController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createReservation);
router.get('/student/:rollNo', authenticateToken, getStudentReservations);
router.get('/', authenticateToken, authorizeRoles('admin'), getReservations);
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), updateReservationStatus);

export default router;

