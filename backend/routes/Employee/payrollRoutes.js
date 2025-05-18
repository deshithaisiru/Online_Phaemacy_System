import express from 'express';
import {
  getPayrollRecords,
  getPayrollByEmployeeId,
  getPayrollByPeriod,
  createPayroll,
  processPayroll,
  generatePayrollReport,
  updatePayroll,
  deletePayroll
} from '../../controllers/Employee/payrollController.js';

const router = express.Router();

// All routes are public now
router.route('/')
  .get(getPayrollRecords)
  .post(createPayroll);

router.route('/:id')
  .put(updatePayroll)
  .delete(deletePayroll);

router.get('/employee/:id', getPayrollByEmployeeId);
router.get('/period/:period', getPayrollByPeriod);
router.get('/report/:period', generatePayrollReport);
router.post('/process', processPayroll);

export default router;
