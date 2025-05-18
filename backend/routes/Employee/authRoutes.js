import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile
} from '../../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', authUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin routes
router.post('/register', protect, admin, registerUser);

export default router;
