import mongoose from 'mongoose';
import Counter from './Counter.js';

const payrollSchema = mongoose.Schema(
  {
    payrollId: {
      type: Number,
      unique: true
    },
    employeeId: {
      type: Number,
      required: true,
      ref: 'Employee'
    },
    payPeriod: {
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
    epfDeduction: {
      type: Number,
      required: true
    },
    etfDeduction: {
      type: Number,
      required: true
    },
    netSalary: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Auto-increment payrollId before saving
payrollSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'payrollId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.payrollId = counter.seq;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
