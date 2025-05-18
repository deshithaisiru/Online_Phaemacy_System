import asyncHandler from 'express-async-handler';
import Payroll from '../../models/Employee/Payroll.js';
import Employee from '../../models/Employee/Employee.js';

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private/Admin
const getPayrollRecords = asyncHandler(async (req, res) => {
  const payrollRecords = await Payroll.find({}).sort({ payPeriod: -1 });
  res.json(payrollRecords);
});

// @desc    Get payroll records by employee ID
// @route   GET /api/payroll/employee/:id
// @access  Private/Admin
const getPayrollByEmployeeId = asyncHandler(async (req, res) => {
  const payrollRecords = await Payroll.find({ employeeId: req.params.id })
    .sort({ payPeriod: -1 })
    .select('payrollId payPeriod basicSalary bonus epfDeduction etfDeduction netSalary');
  
  if (payrollRecords.length > 0) {
    res.json(payrollRecords);
  } else {
    res.status(404);
    throw new Error('No payroll records found for this employee');
  }
});

// @desc    Get payroll records by pay period
// @route   GET /api/payroll/period/:period
// @access  Private/Admin
const getPayrollByPeriod = asyncHandler(async (req, res) => {
  const payrollRecords = await Payroll.find({ payPeriod: req.params.period }).sort({ employeeId: 1 });
  
  if (payrollRecords.length > 0) {
    res.json(payrollRecords);
  } else {
    res.status(404);
    throw new Error('No payroll records found for this period');
  }
});

// @desc    Create a new payroll record
// @route   POST /api/payroll
// @access  Private/Admin
const createPayroll = asyncHandler(async (req, res) => {
  const { employeeId, payPeriod } = req.body;

  // Validation
  if (!employeeId || !payPeriod) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Check if employee exists
  const employee = await Employee.findOne({ employeeId });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }

  // Check if payroll record already exists for this employee in this period
  const existingPayroll = await Payroll.findOne({ employeeId, payPeriod });
  if (existingPayroll) {
    res.status(400);
    throw new Error('Payroll record already exists for this employee in this period');
  }

  // Calculate payroll
  const basicSalary = employee.basicSalary;
  const bonus = employee.bonus || 0;
  const epfDeduction = basicSalary * (8 / 100);
  const etfDeduction = basicSalary * (3 / 100);
  const netSalary = basicSalary - epfDeduction + bonus;

  // Create payroll record
  const payroll = await Payroll.create({
    employeeId,
    payPeriod,
    basicSalary,
    bonus,
    epfDeduction,
    etfDeduction,
    netSalary
  });

  if (payroll) {
    res.status(201).json(payroll);
  } else {
    res.status(400);
    throw new Error('Invalid payroll data');
  }
});

// @desc    Process payroll for all employees for a specific period
// @route   POST /api/payroll/process
// @access  Private/Admin
const processPayroll = asyncHandler(async (req, res) => {
  const { payPeriod } = req.body;

  if (!payPeriod) {
    res.status(400);
    throw new Error('Pay period is required');
  }

  // Get all employees
  const employees = await Employee.find({});
  
  if (employees.length === 0) {
    res.status(404);
    throw new Error('No employees found');
  }

  const results = [];
  const errors = [];

  // Process payroll for each employee
  for (const employee of employees) {
    try {
      // Check if payroll already exists for this employee in this period
      const existingPayroll = await Payroll.findOne({ 
        employeeId: employee.employeeId, 
        payPeriod 
      });
      
      if (existingPayroll) {
        errors.push(`Payroll already exists for employee ID ${employee.employeeId} in period ${payPeriod}`);
        continue;
      }

      // Calculate payroll
      const basicSalary = employee.basicSalary;
      const bonus = employee.bonus || 0;
      const epfDeduction = basicSalary * (8 / 100);
      const etfDeduction = basicSalary * (3 / 100);
      const netSalary = basicSalary - epfDeduction + bonus;

      // Create payroll record
      const payroll = await Payroll.create({
        employeeId: employee.employeeId,
        payPeriod,
        basicSalary,
        bonus,
        epfDeduction,
        etfDeduction,
        netSalary
      });

      results.push(payroll);
    } catch (error) {
      errors.push(`Error processing payroll for employee ID ${employee.employeeId}: ${error.message}`);
    }
  }

  res.status(201).json({
    success: results.length > 0,
    processed: results.length,
    skipped: errors.length,
    results,
    errors
  });
});

// @desc    Generate payroll summary report
// @route   GET /api/payroll/report/:period
// @access  Private/Admin
const generatePayrollReport = asyncHandler(async (req, res) => {
  const payPeriod = req.params.period;
  
  // Get all payroll records for the period
  const payrollRecords = await Payroll.find({ payPeriod }).sort({ employeeId: 1 });
  
  if (payrollRecords.length === 0) {
    res.status(404);
    throw new Error('No payroll records found for this period');
  }

  // Get employee details for each payroll record
  const reportData = await Promise.all(
    payrollRecords.map(async (record) => {
      const employee = await Employee.findOne({ employeeId: record.employeeId });
      return {
        employeeId: record.employeeId,
        employeeName: employee ? employee.name : 'Unknown',
        role: employee ? employee.role : 'Unknown',
        basicSalary: record.basicSalary,
        bonus: record.bonus || 0,
        epfDeduction: record.epfDeduction,
        etfDeduction: record.etfDeduction,
        netSalary: record.netSalary
      };
    })
  );

  // Calculate totals
  const totals = reportData.reduce(
    (acc, curr) => {
      acc.totalBasicSalary += curr.basicSalary;
      acc.totalBonus += curr.bonus;
      acc.totalEpfDeduction += curr.epfDeduction;
      acc.totalEtfDeduction += curr.etfDeduction;
      acc.totalNetSalary += curr.netSalary;
      return acc;
    },
    {
      totalBasicSalary: 0,
      totalBonus: 0,
      totalEpfDeduction: 0,
      totalEtfDeduction: 0,
      totalNetSalary: 0
    }
  );

  // Prepare report data
  const report = {
    payPeriod,
    generatedAt: new Date(),
    employeeCount: reportData.length,
    records: reportData,
    totals
  };

  res.json(report);
});

// @desc    Update a payroll record
// @route   PUT /api/payroll/:id
// @access  Private/Admin
const updatePayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findOne({ payrollId: req.params.id });

  if (payroll) {
    // If basic salary is being updated, recalculate deductions and net salary
    if (req.body.basicSalary) {
      const basicSalary = req.body.basicSalary;
      const epfDeduction = basicSalary * (8 / 100);
      const etfDeduction = basicSalary * (3 / 100);
      const netSalary = basicSalary - epfDeduction;

      payroll.basicSalary = basicSalary;
      payroll.epfDeduction = epfDeduction;
      payroll.etfDeduction = etfDeduction;
      payroll.netSalary = netSalary;
    }

    // Update pay period if provided
    if (req.body.payPeriod) {
      payroll.payPeriod = req.body.payPeriod;
    }

    const updatedPayroll = await payroll.save();
    res.json(updatedPayroll);
  } else {
    res.status(404);
    throw new Error('Payroll record not found');
  }
});

// @desc    Delete a payroll record
// @route   DELETE /api/payroll/:id
// @access  Private/Admin
const deletePayroll = asyncHandler(async (req, res) => {
  const payroll = await Payroll.findOne({ payrollId: req.params.id });

  if (payroll) {
    await Payroll.deleteOne({ payrollId: req.params.id });
    res.json({ message: 'Payroll record removed' });
  } else {
    res.status(404);
    throw new Error('Payroll record not found');
  }
});

export {
  getPayrollRecords,
  getPayrollByEmployeeId,
  getPayrollByPeriod,
  createPayroll,
  processPayroll,
  generatePayrollReport,
  updatePayroll,
  deletePayroll
};
