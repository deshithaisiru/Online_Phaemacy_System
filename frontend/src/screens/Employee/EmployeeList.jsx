import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../components/CustomNotification';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const EmployeeList = () => {
  const { notifySuccess, notifyError } = useNotification();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/employees');
        setEmployees(res.data);
        setFilteredEmployees(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees:', error);
        notifyError('Failed to fetch employees');
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [notifyError]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId.toString().includes(searchTerm)
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:5001/api/employees/${id}`);
        setEmployees(employees.filter((employee) => employee.employeeId !== id));
        notifySuccess('Employee deleted successfully');
      } catch (error) {
        console.error('Error deleting employee:', error);
        notifyError('Failed to delete employee');
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
        <Link
          to="/employees/add"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <FaPlus className="mr-2" /> Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search employees by name, email, role or ID..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No employees found.</p>
          <Link
            to="/employees/add"
            className="inline-block mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            Add your first employee
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Salary
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.employeeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {employee.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs {employee.basicSalary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rs {employee.bonus ? employee.bonus.toFixed(2) : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/employees/${employee.employeeId}`}
                          className="text-primary-600 hover:text-primary-800 p-1 rounded-full hover:bg-gray-100"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/employees/edit/${employee.employeeId}`}
                          className="text-yellow-600 hover:text-yellow-800 p-1 rounded-full hover:bg-gray-100"
                          title="Edit Employee"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDelete(employee.employeeId)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-gray-100"
                          title="Delete Employee"
                        >
                          <FaTrash />
                        </button>
                      </div>
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

export default EmployeeList;
