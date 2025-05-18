import asyncHandler from 'express-async-handler';
import Attendance from '../../models/Employee/Attendance.js';
import Employee from '../../models/Employee/Employee.js';
import { isValidDate, isValidStatus } from '../../utils/validators.js';

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private/Admin
const getAttendanceRecords = asyncHandler(async (req, res) => {
  const attendanceRecords = await Attendance.find({}).sort({ date: -1 });
  res.json(attendanceRecords);
});

// @desc    Get attendance records by employee ID
// @route   GET /api/attendance/employee/:id
// @access  Private/Admin
const getAttendanceByEmployeeId = asyncHandler(async (req, res) => {
  const attendanceRecords = await Attendance.find({ employeeId: req.params.id }).sort({ date: -1 });
  
  if (attendanceRecords.length > 0) {
    res.json(attendanceRecords);
  } else {
    res.status(404);
    throw new Error('No attendance records found for this employee');
  }
});

// @desc    Get attendance records by date
// @route   GET /api/attendance/date/:date
// @access  Private/Admin
const getAttendanceByDate = asyncHandler(async (req, res) => {
  const date = new Date(req.params.date);
  
  if (!isValidDate(date)) {
    res.status(400);
    throw new Error('Invalid date format');
  }
  
  // Set time to start of day
  date.setHours(0, 0, 0, 0);
  
  // Get end of day
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  
  const attendanceRecords = await Attendance.find({
    date: { $gte: date, $lt: nextDay }
  }).sort({ employeeId: 1 });
  
  res.json(attendanceRecords);
});

// @desc    Create a new attendance record
// @route   POST /api/attendance
// @access  Private/Admin
const createAttendance = asyncHandler(async (req, res) => {
  const { employeeId, date, status, clockIn, clockOut } = req.body;

  // Validation
  if (!employeeId || !date || !status) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  if (!isValidDate(date)) {
    res.status(400);
    throw new Error('Invalid date format');
  }

  if (!isValidStatus(status)) {
    res.status(400);
    throw new Error('Invalid status. Must be Present, Absent, or Leave');
  }

  // Check if employee exists
  const employee = await Employee.findOne({ employeeId });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Check if attendance record already exists for this employee on this date
  const attendanceDate = new Date(date);
  attendanceDate.setHours(0, 0, 0, 0);
  
  const nextDay = new Date(attendanceDate);
  nextDay.setDate(attendanceDate.getDate() + 1);
  
  const existingAttendance = await Attendance.findOne({
    employeeId,
    date: { $gte: attendanceDate, $lt: nextDay }
  });

  if (existingAttendance) {
    res.status(400);
    throw new Error('Attendance record already exists for this employee on this date');
  }

  // Create attendance record
  const attendance = await Attendance.create({
    employeeId,
    date: attendanceDate,
    status,
    clockIn: status === 'Present' ? clockIn : null,
    clockOut: status === 'Present' && clockOut ? clockOut : null
  });

  if (attendance) {
    res.status(201).json(attendance);
  } else {
    res.status(400);
    throw new Error('Invalid attendance data');
  }
});

// @desc    Update an attendance record
// @route   PUT /api/attendance/:id
// @access  Private/Admin
const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({ attendanceId: req.params.id });

  if (attendance) {
    // Validation
    if (req.body.status && !isValidStatus(req.body.status)) {
      res.status(400);
      throw new Error('Invalid status. Must be Present, Absent, or Leave');
    }

    if (req.body.date && !isValidDate(req.body.date)) {
      res.status(400);
      throw new Error('Invalid date format');
    }

    // Update fields
    attendance.status = req.body.status || attendance.status;
    
    if (req.body.date) {
      const attendanceDate = new Date(req.body.date);
      attendanceDate.setHours(0, 0, 0, 0);
      attendance.date = attendanceDate;
    }
    
    if (req.body.clockIn && attendance.status === 'Present') {
      attendance.clockIn = req.body.clockIn;
    }
    
    if (req.body.clockOut && attendance.status === 'Present') {
      attendance.clockOut = req.body.clockOut;
    }

    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } else {
    res.status(404);
    throw new Error('Attendance record not found');
  }
});

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Private/Admin
const deleteAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({ attendanceId: req.params.id });

  if (attendance) {
    await Attendance.deleteOne({ attendanceId: req.params.id });
    res.json({ message: 'Attendance record removed' });
  } else {
    res.status(404);
    throw new Error('Attendance record not found');
  }
});

export { 
  getAttendanceRecords, 
  getAttendanceByEmployeeId, 
  getAttendanceByDate, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance 
};
