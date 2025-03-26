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

export default function AdminDashboard() {
  const dashboardItems = [
    {
      name: 'Customer Management',
      path: '/admin/customers',
      icon: '👥',
      description: 'Manage customer profiles and accounts'
    },
    {
      name: 'Employee Management',
      path: '/admin/employees',
      icon: '👨‍⚕️',
      description: 'Manage pharmacy staff and roles'
    },
    {
      name: 'Supplier Management',
      path: '/admin/suppliers',
      icon: '🤝',
      description: 'Manage relationships with pharmaceutical suppliers'
    },
    {
      name: 'Payment History',
      path: '/admin/payments',
      icon: '💳',
      description: 'Track payments and financial records'
    },
    {
      name: 'Reports & Analytics',
      path: '/admin/reports',
      icon: '📊',
      description: 'View reports and analytics for business insights'
    }
  ];

  return (
    <div 
      className="min-h-screen px-6 bg-cover bg-center bg-no-repeat py-24"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
            <p className="text-yellow-100/80 text-lg">Manage the pharmacy operations efficiently</p>
          </div>

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
