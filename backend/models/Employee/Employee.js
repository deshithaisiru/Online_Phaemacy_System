import mongoose from 'mongoose';
import Counter from './Counter.js';

const employeeSchema = mongoose.Schema(
  {
    employeeId: {
      type: Number,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    basicSalary: {
      type: Number,
      required: true
    },
    bonus: {
      type: Number,
      default: 0
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-increment employeeId before saving
employeeSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'employeeId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.employeeId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
