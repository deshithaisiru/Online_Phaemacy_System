import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } from '../../utils/toastConfig';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    clockIn: '',
    clockOut: ''
  });

  const { employeeId, date, status, clockIn, clockOut } = formData;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/employees');
        setEmployees(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        showErrorToast('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!employeeId || !date || !status) {
      showErrorToast('Please fill in all required fields');
      return;
    }

    // If status is Present, clock in is required
    if (status === 'Present' && !clockIn) {
      showErrorToast('Clock In time is required for Present status');
      return;
    }

    try {
      setSubmitting(true);
      
      const attendanceData = {
        employeeId: Number(employeeId),
        date,
        status,
        clockIn: status === 'Present' ? `${date}T${clockIn}:00` : null,
        clockOut: status === 'Present' && clockOut ? `${date}T${clockOut}:00` : null
      };

      await axios.post('http://localhost:5001/api/attendance', attendanceData);
      
      showSuccessToast('Attendance marked successfully');
      navigate('/attendance');
    } catch (error) {
      console.error('Error marking attendance:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark attendance';
      showErrorToast(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/attendance')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Mark Attendance</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee *
              </label>
              <select
                name="employeeId"
                value={employeeId}
                onChange={onChange}
                className="form-input"
                required
              >
                <option value="">Select an employee</option>
                {employees.map((employee) => (
                  <option key={employee.employeeId} value={employee.employeeId}>
                    {employee.name} (ID: {employee.employeeId})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={date}
                onChange={onChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={status}
                onChange={onChange}
                className="form-input"
                required
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">Leave</option>
              </select>
            </div>

            {status === 'Present' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clock In Time *
                  </label>
                  <input
                    type="time"
                    name="clockIn"
                    value={clockIn}
                    onChange={onChange}
                    className="form-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clock Out Time (Optional)
                  </label>
                  <input
                    type="time"
                    name="clockOut"
                    value={clockOut}
                    onChange={onChange}
                    className="form-input"
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/attendance')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              disabled={submitting}
            >
              {submitting ? (
                'Saving...'
              ) : (
                <>
                  <FaSave className="mr-2" /> Mark Attendance
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAttendance;
