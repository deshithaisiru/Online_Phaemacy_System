import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PackageTimer from '../screens/Packages/components/timer';
import ShowPackage from '../screens/Packages/components/Showpackages';
import BMICalc from '../components/BMICalculator';
import PackagePlans from '../screens/Packages/palan';

const MemberDashboard = () => {
  const [userPackages, setUserPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = useSelector((state) => state.auth.userInfo?._id);

  useEffect(() => {
    const fetchUserPackages = async () => {
      try {
        const response = await fetch(`/api/packages/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user packages');
        }
        const data = await response.json();
        setUserPackages(data);
      } catch (err) {
        console.error('Error fetching user packages:', err);
        setError('Error fetching user packages');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserPackages();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-20">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="Dashboard Background"
          className="absolute inset-0 w-full h-full object-cover opacity-50 transform scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight text-center">
            Welcome to <span className="text-yellow-500">Your Dashboard</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-12 font-light text-center">
            Track your progress and manage your fitness journey
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-6 py-4 rounded-xl mb-8 text-center">
              <strong className="font-bold">Error: </strong>
              <span>{error}</span>
            </div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Enroll Package Card */}
            <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 hover:bg-white/10 transition duration-500 ease-in-out">
              <div className="flex items-center justify-center text-6xl group-hover:scale-110 transition duration-300 mb-6">
                📦
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Enroll Package</h2>
              <div className="text-gray-300">
                <ShowPackage />
              </div>
            </div>

            {/* Package Timer Card */}
            <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 hover:bg-white/10 transition duration-500 ease-in-out">
              <div className="flex items-center justify-center text-6xl group-hover:scale-110 transition duration-300 mb-6">
                ⏱️
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">Package Timer</h2>
              <div className="text-gray-300">
                {userPackages.length > 0 ? (
                  <PackageTimer 
                    startDate={userPackages[0].startDate} 
                    validity={userPackages[0].validity} 
                  />
                ) : (
                  <p className="text-center text-gray-400 font-light">No active packages</p>
                )}
              </div>
            </div>

            {/* BMI Calculator Card */}
            <div className="group bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 hover:bg-white/10 transition duration-500 ease-in-out">
              <div className="flex items-center justify-center text-6xl group-hover:scale-110 transition duration-300 mb-6">
                📊
              </div>
              <h2 className="text-2xl font-bold text-white mb-4 text-center">BMI Calculator</h2>
              <div className="text-gray-300">
                <BMICalc />
              </div>
            </div>
          </div>

          {/* Package Plans Section */}
          <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent"></div>
            <div className="relative p-8">
              <h2 className="text-4xl font-bold text-white mb-6 text-center">
                Available <span className="text-yellow-500">Package Plans</span>
              </h2>
              <div className="text-gray-300">
                <PackagePlans />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;