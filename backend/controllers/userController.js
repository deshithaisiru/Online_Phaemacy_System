import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// Get Single User (Admin Only)
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Auth User & Get Token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);  // Unauthorized error
    throw new Error('Invalid email or password');  // If user is not found
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(401);  // Unauthorized error
    throw new Error('Invalid email or password');  // If passwords don't match
  }

  // Return user details and a token if authentication is successful
  generateToken(res, user._id);
  
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    isAdmin: user.isAdmin,
    userType: user.role === 'admin' ? 'Admin' : 'Customer'
  });
});

// Register User & Create Token
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, mobile, role = 'client' } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    mobile,
    role,
  });

  if (user) {
    generateToken(res, user._id);
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      isAdmin: user.isAdmin,
      role: user.role
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Logout User (Clear token)
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Error during logout');
  }
});

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    address: user.address,
    isAdmin: user.isAdmin,
  });
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.mobile = req.body.mobile || user.mobile;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    isAdmin: updatedUser.isAdmin,
  });
});

// Update User by ID (Admin Only)
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.mobile = req.body.mobile || user.mobile;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    isAdmin: updatedUser.isAdmin,
  });
});



// Delete User by ID (Admin Only)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await User.deleteOne({ _id: user._id });
  res.json({ message: 'User removed successfully' });
});

// Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Add logic to generate password reset token and send email
  // For example, generate a token and send it to the user via email

  res.status(200).json({ message: 'Password reset email sent' });
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Verify token and reset the password
  // Add logic to verify token and update the user's password in the database

  res.status(200).json({ message: 'Password successfully reset' });
});

export {
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
  resetPassword,
};
