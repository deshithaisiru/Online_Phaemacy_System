import asyncHandler from 'express-async-handler';
import Employee from '../../models/Employee/Employee.js';
import { isValidEmail, isValidPhoneNumber, isValidSalary, isValidRole } from '../../utils/validators.js';

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.find({});
  res.json(employees);
});

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private/Admin
const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });

  if (employee) {
    res.json(employee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = asyncHandler(async (req, res) => {
  const { name, role, basicSalary, email, phoneNumber, bonus } = req.body;

  // Validation
  if (!name || !role || !basicSalary || !email || !phoneNumber) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  if (!isValidEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  if (!isValidPhoneNumber(phoneNumber)) {
    res.status(400);
    throw new Error('Invalid phone number format');
  }

  if (!isValidSalary(basicSalary)) {
    res.status(400);
    throw new Error('Invalid salary amount');
  }

  // Check if employee with this email already exists
  const employeeExists = await Employee.findOne({ email });

  if (employeeExists) {
    res.status(400);
    throw new Error('Employee with this email already exists');
  }

  // Create employee
  const employee = await Employee.create({
    name,
    role,
    basicSalary,
    email,
    phoneNumber,
    bonus: bonus || 0
  });

  if (employee) {
    res.status(201).json(employee);
  } else {
    res.status(400);
    throw new Error('Invalid employee data');
  }
});

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });

  if (employee) {
    // Validation
    if (req.body.email && !isValidEmail(req.body.email)) {
      res.status(400);
      throw new Error('Invalid email format');
    }

    if (req.body.phoneNumber && !isValidPhoneNumber(req.body.phoneNumber)) {
      res.status(400);
      throw new Error('Invalid phone number format');
    }

    if (req.body.basicSalary && !isValidSalary(req.body.basicSalary)) {
      res.status(400);
      throw new Error('Invalid salary amount');
    }

    // Update fields
    employee.name = req.body.name || employee.name;
    employee.role = req.body.role || employee.role;
    employee.basicSalary = req.body.basicSalary || employee.basicSalary;
    employee.email = req.body.email || employee.email;
    employee.phoneNumber = req.body.phoneNumber || employee.phoneNumber;
    employee.bonus = req.body.bonus !== undefined ? req.body.bonus : employee.bonus;

    const updatedEmployee = await employee.save();
    res.json(updatedEmployee);
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ employeeId: req.params.id });

  if (employee) {
    await Employee.deleteOne({ employeeId: req.params.id });
    res.json({ message: 'Employee removed' });
  } else {
    res.status(404);
    throw new Error('Employee not found');
  }
});

export { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee };
