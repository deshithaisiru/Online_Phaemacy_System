import mongoose from 'mongoose';
import Counter from './Counter.js';

const attendanceSchema = mongoose.Schema(
  {
    attendanceId: {
      type: Number,
      unique: true
    },
    employeeId: {
      type: Number,
      required: true,
      ref: 'Employee'
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Leave']
    },
    clockIn: {
      type: Date,
      required: function() {
        return this.status === 'Present';
      }
    },
    clockOut: {
      type: Date,
      required: false
    }
  },
  {
    timestamps: true
  }
);

// Auto-increment attendanceId before saving
attendanceSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'attendanceId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.attendanceId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
