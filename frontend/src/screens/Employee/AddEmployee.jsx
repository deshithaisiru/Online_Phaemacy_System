import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    basicSalary: '',
    email: '',
    phoneNumber: '',
    bonus: '0'
  });
  const [errors, setErrors] = useState({
    name: '',
    role: '',
    basicSalary: '',
    email: '',
    phoneNumber: '',
    bonus: ''
  });
  const [saving, setSaving] = useState(false);

  const { name, role, basicSalary, email, phoneNumber, bonus } = formData;

  const validateField = (name, value) => {
    let errorMessage = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          errorMessage = 'Name is required';
        } else if (value.trim().length < 3) {
          errorMessage = 'Name must be at least 3 characters';
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
          errorMessage = 'Name should contain only letters and spaces';
        }
        break;
      case 'role':
        if (!value) {
          errorMessage = 'Role is required';
        }
        break;
      case 'basicSalary':
        if (!value) {
          errorMessage = 'Basic salary is required';
        } else if (isNaN(value) || Number(value) <= 0) {
          errorMessage = 'Basic salary must be a positive number';
        }
        break;
      case 'bonus':
        if (!value) {
          errorMessage = 'Bonus is required';
        } else if (isNaN(value) || Number(value) < 0) {
          errorMessage = 'Bonus must be a non-negative number';
        }
        break;
      case 'email':
        if (!value) {
          errorMessage = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
          }
        }
        break;
      case 'phoneNumber':
        if (!value) {
          errorMessage = 'Phone number is required';
        } else {
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(value)) {
            errorMessage = 'Please enter a valid 10-digit phone number';
          }
        }
        break;
      default:
        break;
    }
    
    return errorMessage;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate field on change
    const errorMessage = validateField(name, value);
    setErrors({ ...errors, [name]: errorMessage });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.basicSalary) newErrors.basicSalary = 'Basic salary is required';
    if (formData.basicSalary && isNaN(formData.basicSalary)) newErrors.basicSalary = 'Basic salary must be a number';
    if (formData.bonus && isNaN(formData.bonus)) newErrors.bonus = 'Bonus must be a number';
    if (formData.bonus && parseFloat(formData.bonus) < 0) newErrors.bonus = 'Bonus cannot be negative';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      setSaving(true);
      
      const employeeData = {
        name,
        role,
        basicSalary: Number(basicSalary),
        email,
        phoneNumber,
        bonus: Number(bonus)
      };

      await axios.post('http://localhost:5001/api/employees', employeeData);
      
      toast.success('Employee added successfully');
      navigate('/employees');
    } catch (error) {
      console.error('Error adding employee:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add employee';
      toast.error(errorMessage);
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/employees')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Add New Employee</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                name="role"
                value={role}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a role</option>
                <option value="Inventory Manager">Inventory Manager</option>
                <option value="User Manager">User Manager</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Basic Salary
              </label>
              <input
                type="number"
                name="basicSalary"
                value={basicSalary}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.basicSalary ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter basic salary"
              />
              {errors.basicSalary && (
                <p className="mt-1 text-sm text-red-600">{errors.basicSalary}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bonus
              </label>
              <input
                type="number"
                name="bonus"
                value={bonus}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.bonus ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter bonus amount"
                min="0"
              />
              {errors.bonus && (
                <p className="mt-1 text-sm text-red-600">{errors.bonus}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={onChange}
                className={`form-input w-full rounded-md border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={saving}
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <FaSave className="mr-2" /> Save Employee
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
