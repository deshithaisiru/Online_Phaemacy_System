import React from 'react';
import { useNavigate } from 'react-router-dom';

// Card component moved inside the same file for better organization
const DashboardCard = ({ name, path, icon, description }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => navigate(path)}
      className="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm border border-yellow-500/20 p-6 hover:bg-black/50 transition-all cursor-pointer hover:shadow-lg hover:shadow-yellow-500/10 py-10"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center text-2xl shadow-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{name}</h3>
          <p className="text-yellow-100/80 text-sm">{description}</p>
        </div>
      </div>
      <div className="absolute inset-0 border-2 border-yellow-500 opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity" />
    </div>
  );
};

export default function Dashboard() {
  const dashboardItems = [
    {
      name: 'Client Management',
      path: '/admin-dashboard',
      icon: '👥',
      description: 'Manage client profiles and relationships'
    },
    {
      name: 'Inventory Management',
      path: '/inventory',
      icon: '📦',
      description: 'Track and manage equipment inventory'
    },
    {
      name: 'Package Management',
      path: '/package',
      icon: '🎁',
      description: 'Configure and maintain service packages'
    },
    {
      name: 'Employee Management',
      path: '/employeefun',
      icon: '👤',
      description: 'Handle staff and trainer information'
    },
    {
      name: 'Supplier Management',
      path: '/supplierM',
      icon: '🤝',
      description: 'Manage vendor relationships and orders'
    },
    {
      name: 'Progress Tracking',
      path: '/ProgressM',
      icon: '📈',
      description: 'Monitor fitness goals and achievements'
    },
    {
      name: 'Schedule Management',
      path: '/schedulemanage',
      icon: '📅',
      description: 'Organize classes and appointments'
    },
    {
      name: 'Customer Affairs',
      path: '/adminfeedback',
      icon: '💬',
      description: 'Handle feedback and customer support'
    }
  ];

  return (
    <div 
      className="min-h-screen px-6 bg-cover bg-center bg-no-repeat py-24"
      style={{
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-yellow-100/80 text-lg">Manage your fitness center operations</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              name={item.name}
              path={item.path}
              icon={item.icon}
              description={item.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}