import { Router } from 'express';
import { 
  authUser, 
  registerUser, 
  logoutUser, 
  getUserProfile, 
  updateUserProfile, 
  updateUserById,
  getAllUsers, 
  getUser,
  deleteUser, 
  forgotPassword, 
  resetPassword 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Routes
router.post('/auth', authUser); // Main authentication route
router.post('/login', authUser); // Keep for backward compatibility
router.post('/register', registerUser);
router.post('/auth/logout', protect, logoutUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/all', getAllUsers);
router.route('/:id')
  .get(getUser)
  .put(updateUserById)
  .delete(deleteUser);

// Forgot password functionality
router.post('/forgot-password', forgotPassword);  // Add this route
router.put('/reset-password/:token', resetPassword); // Add this route

export default router;
