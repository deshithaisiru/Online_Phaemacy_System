import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['client', 'admin'],  // Specify roles
      default: 'client',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    height: {
      type: Number,
      required: false, // Optional field
    },
    weight: {
      type: Number,
      required: false, // Optional field
    },
    birthday: {
      type: Date,
      required: false, // Optional field
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false, // Optional field
    },
    // Optional: Prescription uploads, if required for medical-related products
    prescription: {
      type: String,  // Could store a URL or file reference for prescription upload
      required: false,
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Continue to the next middleware
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

