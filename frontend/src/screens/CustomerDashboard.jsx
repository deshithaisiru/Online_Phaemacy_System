import React from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';

const DashboardCard = ({ name, path, icon, description, image }) => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className="group relative overflow-hidden rounded-2xl bg-white/95 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function CustomerDashboard() {
  const dashboardItems = [
    {
      name: 'Browse Medicines',
      path: '/medicines',
      icon: '💊',
      description: 'Browse and order medicines',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'My Orders',
      path: '/orders',
      icon: '📦',
      description: 'View and track your orders',
      image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Upload Prescription',
      path: '/upload-prescription',
      icon: '📄',
      description: 'Upload your prescriptions',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'My Profile',
      path: '/profile',
      icon: '👤',
      description: 'Manage your profile and settings',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Welcome to MediCart</h1>
            <p className="text-xl text-blue-100">Your trusted healthcare companion</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={index}
              name={item.name}
              path={item.path}
              icon={item.icon}
              description={item.description}
              image={item.image}
            />
          ))}
        </motion.div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-blue-600 text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-purple-600 text-4xl font-bold mb-2">1000+</div>
            <div className="text-gray-600">Medicines Available</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-blue-600 text-4xl font-bold mb-2">30min</div>
            <div className="text-gray-600">Fast Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
}
