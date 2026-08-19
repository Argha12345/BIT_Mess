import express from 'express';
import { getMenu, updateMenuItem } from '../controllers/menuController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMenu);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateMenuItem);

export default router;

