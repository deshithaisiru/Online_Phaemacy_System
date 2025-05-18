import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    employeeCount: 0,
    attendanceToday: 0,
    payrollProcessed: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get employee count
        const employeeRes = await axios.get('http://localhost:5001/api/employees');
        
        // Get today's attendance
        const today = new Date().toISOString().split('T')[0];
        const attendanceRes = await axios.get(`http://localhost:5001/api/attendance/date/${today}`);
        
        // Get payroll for current month
        const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
        const payrollRes = await axios.get(`http://localhost:5001/api/payroll/period/${currentMonth}`);
        
        setStats({
          employeeCount: employeeRes.data.length,
          attendanceToday: attendanceRes.data.length,
          payrollProcessed: payrollRes.data.length
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // If API fails, set some default values
        setStats({
          employeeCount: 0,
          attendanceToday: 0,
          payrollProcessed: 0
        });
      }
    };
    
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.employeeCount,
      icon: <FaUsers className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-100 border-blue-500',
      link: '/employees'
    },
    {
      title: 'Today\'s Attendance',
      value: stats.attendanceToday,
      icon: <FaCalendarCheck className="w-8 h-8 text-green-500" />,
      color: 'bg-green-100 border-green-500',
      link: '/attendance'
    },
    {
      title: 'Payroll Processed',
      value: stats.payrollProcessed,
      icon: <FaMoneyBillWave className="w-8 h-8 text-yellow-500" />,
      color: 'bg-yellow-100 border-yellow-500',
      link: '/payroll'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto mt-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <a 
            key={index} 
            href={card.link} 
            className={`${card.color} border-l-4 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
              </div>
              <div>{card.icon}</div>
            </div>
          </a>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/employees/add" 
              className="bg-primary-600 text-white rounded-lg p-4 text-center hover:bg-primary-700 transition-colors duration-200"
            >
              Add New Employee
            </a>
            <a 
              href="/attendance/mark" 
              className="bg-green-600 text-white rounded-lg p-4 text-center hover:bg-green-700 transition-colors duration-200"
            >
              Mark Attendance
            </a>
            <a 
              href="/payroll/process" 
              className="bg-yellow-600 text-white rounded-lg p-4 text-center hover:bg-yellow-700 transition-colors duration-200"
            >
              Process Payroll
            </a>
            <a 
              href="/payroll/report" 
              className="bg-purple-600 text-white rounded-lg p-4 text-center hover:bg-purple-700 transition-colors duration-200"
            >
              Generate Reports
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
