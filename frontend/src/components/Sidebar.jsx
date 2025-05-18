import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaChartBar
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    {
      path: '/admin/employees',
      name: 'Dashboard',
      icon: <FaChartBar className="w-5 h-5" />,
    },
    {
      path: '/employees',
      name: 'Employees',
      icon: <FaUsers className="w-5 h-5" />,
    },
    {
      path: '/attendance',
      name: 'Attendance',
      icon: <FaCalendarAlt className="w-5 h-5" />,
    },
    {
      path: '/payroll',
      name: 'Payroll',
      icon: <FaMoneyBillWave className="w-5 h-5" />,
    }
  ];

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-800 text-white h-screen transition-all duration-300 fixed top-0 left-0 z-40 pt-16`}
    >
      <div className="p-4">
        <button
          onClick={toggleSidebar}
          className="w-full flex justify-end text-white focus:outline-none"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              ></path>
            </svg>
          )}
        </button>
      </div>
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                } transition-colors duration-200`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                {isOpen && (
                  <span className="ml-3 transition-opacity duration-300">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
