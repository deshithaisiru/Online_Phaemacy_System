import express from 'express';
import {
  getAttendanceRecords,
  getAttendanceByEmployeeId,
  getAttendanceByDate,
  createAttendance,
  updateAttendance,
  deleteAttendance
} from '../../controllers/Employee/attendanceController.js';

const router = express.Router();

// All routes are public now
router.route('/')
  .get(getAttendanceRecords)
  .post(createAttendance);

router.route('/:id')
  .put(updateAttendance)
  .delete(deleteAttendance);

router.get('/employee/:id', getAttendanceByEmployeeId);
router.get('/date/:date', getAttendanceByDate);

export default router;
