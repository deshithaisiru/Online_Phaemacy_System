import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaMoneyBillWave } from 'react-icons/fa';

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // Fetch employee details
        const employeeRes = await axios.get(`http://localhost:5001/api/employees/${id}`);
        setEmployee(employeeRes.data);
        
        // Fetch attendance records
        const attendanceRes = await axios.get(`http://localhost:5001/api/attendance/employee/${id}`);
        setAttendanceRecords(attendanceRes.data);
        
        // Fetch payroll records
        const payrollRes = await axios.get(`http://localhost:5001/api/payroll/employee/${id}`);
        setPayrollRecords(payrollRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        toast.error('Failed to fetch employee details');
        navigate('/employees');
      }
    };

    fetchEmployeeData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5001/api/employees/${id}`);
        toast.success('Employee deleted successfully');
        navigate('/employees');
      } catch (error) {
        console.error('Error deleting employee:', error);
        toast.error('Failed to delete employee');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
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
          onClick={() => navigate('/employees')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Employee Details</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{employee.name}</h2>
              <p className="text-gray-600 mt-1">Employee ID: {employee.employeeId}</p>
              <div className="mt-2 inline-block bg-primary-100 text-primary-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {employee.role}
              </div>
            </div>
            <div className="flex space-x-2">
              <Link
                to={`/employees/edit/${employee.employeeId}`}
                className="flex items-center px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                <FaEdit className="mr-1" /> Edit
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'attendance'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('attendance')}
            >
              <FaCalendarAlt className="inline-block mr-1" /> Attendance
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'payroll'
                  ? 'border-b-2 border-primary-500 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('payroll')}
            >
              <FaMoneyBillWave className="inline-block mr-1" /> Payroll
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800">{employee.phoneNumber}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Employment Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="text-gray-800">{employee.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Basic Salary</p>
                    <p className="text-gray-800">${employee.basicSalary.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bonus</p>
                    <p className="text-gray-800">${(employee.bonus || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="text-gray-800">{formatDate(employee.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Attendance Records</h3>
                <Link
                  to="/attendance/mark"
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                >
                  Mark Attendance
                </Link>
              </div>

              {attendanceRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No attendance records found for this employee.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock In
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clock Out
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceRecords.map((record) => (
                        <tr key={record.attendanceId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                record.status === 'Present'
                                  ? 'bg-green-100 text-green-800'
                                  : record.status === 'Absent'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.clockIn ? formatTime(record.clockIn) : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.clockOut ? formatTime(record.clockOut) : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payroll' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Payroll Records</h3>
                <Link
                  to="/payroll/process"
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
                >
                  Process Payroll
                </Link>
              </div>

              {payrollRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payroll records found for this employee.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pay Period
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Basic Salary
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bonus
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EPF Deduction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ETF Deduction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Net Salary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payrollRecords.map((record) => (
                        <tr key={record.payrollId}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.payPeriod}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs {record.basicSalary.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs {record.bonus ? record.bonus.toFixed(2) : '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs {record.epfDeduction.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rs {record.etfDeduction.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Rs {record.netSalary.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
