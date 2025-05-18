import React from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const EmployeeCard = ({ employee, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{employee.name}</h3>
          <p className="text-sm text-gray-600 mt-1">ID: {employee.employeeId}</p>
        </div>
        <div className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {employee.role}
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {employee.email}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Phone:</span> {employee.phoneNumber}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Basic Salary:</span> ${employee.basicSalary.toFixed(2)}
        </p>
      </div>
      
      <div className="mt-6 flex justify-end space-x-2">
        <Link
          to={`/employees/${employee.employeeId}`}
          className="text-primary-600 hover:text-primary-800 p-2 rounded-full hover:bg-gray-100"
          title="View Details"
        >
          <FaEye />
        </Link>
        <Link
          to={`/employees/edit/${employee.employeeId}`}
          className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-gray-100"
          title="Edit Employee"
        >
          <FaEdit />
        </Link>
        <button
          onClick={() => onDelete(employee.employeeId)}
          className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-gray-100"
          title="Delete Employee"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
