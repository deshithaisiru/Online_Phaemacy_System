import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../components/CustomNotification';
import { FaPlus, FaSearch, FaFileAlt, FaTrash } from 'react-icons/fa';

const PayrollList = () => {
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPeriod, setSearchPeriod] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all payroll records
        const payrollRes = await axios.get('http://localhost:5001/api/payroll');
        setPayrollRecords(payrollRes.data);
        setFilteredRecords(payrollRes.data);
        
        // Fetch all employees to get their names
        const employeesRes = await axios.get('http://localhost:5001/api/employees');
        setEmployees(employeesRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        notifyError('Failed to fetch payroll records');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchPeriod.trim() === '') {
      setFilteredRecords(payrollRecords);
    } else {
      const filtered = payrollRecords.filter((record) => 
        record.payPeriod.includes(searchPeriod)
      );
      setFilteredRecords(filtered);
    }
  }, [searchPeriod, payrollRecords]);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await axios.delete(`http://localhost:5001/api/payroll/${id}`);
        setPayrollRecords(payrollRecords.filter((record) => record.payrollId !== id));
        notifySuccess('Payroll record deleted successfully');
      } catch (error) {
        console.error('Error deleting payroll record:', error);
        notifyError('Failed to delete payroll record');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Payroll Records</h1>
        <div className="flex space-x-2">
          <Link
            to="/payroll/process"
            className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <FaPlus className="mr-2" /> Process Payroll
          </Link>
          <Link
            to="/payroll/report"
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <FaFileAlt className="mr-2" /> Generate Report
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="searchPeriod" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Pay Period (YYYY-MM)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                id="searchPeriod"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g. 2023-10"
                value={searchPeriod}
                onChange={(e) => setSearchPeriod(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              onClick={() => setSearchPeriod('')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 w-full md:w-auto"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No payroll records found.</p>
          <Link
            to="/payroll/process"
            className="inline-block mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Process payroll
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pay Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EPF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ETF
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.payrollId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEmployeeName(record.employeeId)}
                      </div>
                      <div className="text-sm text-gray-500">ID: {record.employeeId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.payPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.basicSalary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.epfDeduction.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs{record.etfDeduction.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Rs{record.netSalary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(record.payrollId)}
                        className="text-red-600 hover:text-red-900 ml-4"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollList;
