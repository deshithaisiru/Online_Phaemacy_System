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
router.post('/login', authUser); // Ensure this is the login route for user authentication
router.post('/register', registerUser);
router.post('/auth/logout', protect, logoutUser);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/all', getAllUsers);
router.route('/:id')
  .get(getUser)
  .put(updateUserById)
  .delete(deleteUser);
router.post('/auth', authUser); 

// Forgot password functionality
router.post('/forgot-password', forgotPassword);  // Add this route
router.put('/reset-password/:token', resetPassword); // Add this route

export default router;
