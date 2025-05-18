import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../components/CustomNotification';
import { FaArrowLeft, FaMoneyBillWave } from 'react-icons/fa';

const ProcessPayroll = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [formData, setFormData] = useState({
    payPeriod: new Date().toISOString().slice(0, 7), // Format: YYYY-MM
    employeeId: '', // For individual processing
    processAll: true
  });

  const { payPeriod, employeeId, processAll } = formData;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/employees');
        setEmployees(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        notifyError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const processPayroll = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const payrollData = {
        payPeriod,
        employeeId: processAll ? null : employeeId,
        processAll
      };

      const response = await axios.post('http://localhost:5001/api/payroll/process', payrollData);
      
      if (response.data.success) {
        notifySuccess('Payroll processed successfully');
        navigate('/payroll');
      } else {
        notifyError(response.data.message || 'Failed to process payroll');
      }
    } catch (error) {
      console.error('Error processing payroll:', error);
      notifyError(error.response?.data?.message || 'Failed to process payroll');
    } finally {
      setProcessing(false);
    }
  };

  const calculateNetSalary = (employee) => {
    const basicSalary = Number(employee.basicSalary);
    const bonus = Number(employee.bonus || 0);
    const epfDeduction = (basicSalary + bonus) * 0.08; // 8% EPF on total (basic + bonus)
    const etfDeduction = (basicSalary + bonus) * 0.03; // 3% ETF on total (basic + bonus)
    return (basicSalary + bonus - epfDeduction - etfDeduction).toFixed(2);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-16 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/payroll')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Process Payroll</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={processPayroll}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pay Period *
              </label>
              <input
                type="month"
                name="payPeriod"
                value={payPeriod}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="processAll"
                checked={processAll}
                onChange={onChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Process payroll for all employees
              </label>
            </div>

            {!processAll && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Employee *
                </label>
                <select
                  name="employeeId"
                  value={employeeId}
                  onChange={onChange}
                  className="form-input"
                  required={!processAll}
                  disabled={processAll}
                >
                  <option value="">Select an employee</option>
                  {employees.map((employee) => (
                    <option key={employee.employeeId} value={employee.employeeId}>
                      {employee.name} (ID: {employee.employeeId}) - Net Salary: Rs {calculateNetSalary(employee)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/payroll')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={processing || loading}
            >
              {processing ? (
                'Processing...'
              ) : (
                <>
                  <FaMoneyBillWave className="mr-2" /> Process Payroll
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcessPayroll;
