import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all attendance records
        const attendanceRes = await axios.get('http://localhost:5001/api/attendance');
        setAttendanceRecords(attendanceRes.data);
        setFilteredRecords(attendanceRes.data);
        
        // Fetch all employees to get their names
        const employeesRes = await axios.get('http://localhost:5001/api/employees');
        setEmployees(employeesRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        toast.error('Failed to fetch attendance records');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchDate.trim() === '') {
      setFilteredRecords(attendanceRecords);
    } else {
      const filtered = attendanceRecords.filter((record) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === searchDate;
      });
      setFilteredRecords(filtered);
    }
  }, [searchDate, attendanceRecords]);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.employeeId === employeeId);
    return employee ? employee.name : 'Unknown';
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await axios.delete(`http://localhost:5001/api/attendance/${id}`);
        setAttendanceRecords(attendanceRecords.filter((record) => record.attendanceId !== id));
        toast.success('Attendance record deleted successfully');
      } catch (error) {
        console.error('Error deleting attendance record:', error);
        toast.error('Failed to delete attendance record');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Records</h1>
        <Link
          to="/attendance/mark"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <FaPlus className="mr-2" /> Mark Attendance
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="date"
                id="searchDate"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              &nbsp;
            </label>
            <button
              onClick={() => setSearchDate('')}
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
          <p className="text-gray-500 text-lg">No attendance records found.</p>
          <Link
            to="/attendance/mark"
            className="inline-block mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Mark attendance
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
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map((record) => (
                  <tr key={record.attendanceId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEmployeeName(record.employeeId)}
                      </div>
                      <div className="text-sm text-gray-500">ID: {record.employeeId}</div>
                    </td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(record.attendanceId)}
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

export default AttendanceList;
