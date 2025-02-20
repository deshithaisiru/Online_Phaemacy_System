import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Packages = () => {
  const [enrolledPackages, setEnrolledPackages] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(`/api/packages/user/${userInfo._id}`);
        const data = await response.json();

        if (response.ok) {
          setEnrolledPackages(data);
        } else {
          console.error('Error fetching packages:', data.message);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    if (userInfo) {
      fetchPackages();
    }
  }, [userInfo]);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Your <span className="text-yellow-500">Enrolled Packages</span>
      </h1>

      {enrolledPackages.length > 0 ? (
        <div className="grid gap-6">
          {enrolledPackages.map((pkg) => (
            <div
              key={pkg._id}
              className="group bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-102 transition-all duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-yellow-500">
                      {pkg.packname}
                    </h2>
                    <span className="px-4 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                      ${pkg.price}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Start Date:</span>
                        <span className="text-white">
                          {new Date(pkg.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">Validity:</span>
                        <span className="text-white">
                          {pkg.validity} days
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end">
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                        <div className="text-sm text-gray-400">End Date</div>
                        <div className="text-white font-medium">
                          {new Date(new Date(pkg.startDate).getTime() + pkg.validity * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-400 text-lg">
            You are not enrolled in any packages yet.
          </p>
          <a 
            href="/packages" 
            className="inline-block mt-4 px-6 py-2 bg-yellow-500 text-white rounded-full font-medium hover:bg-yellow-600 transform hover:-translate-y-1 transition-all duration-300"
          >
            Browse Packages
          </a>
        </div>
      )}
    </div>
  );
};

export default Packages;