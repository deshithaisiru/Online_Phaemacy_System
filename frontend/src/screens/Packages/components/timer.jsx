import React, { useState, useEffect } from 'react';

const PackageTimer = ({ startDate, validity }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + validity * 24 * 60 * 60 * 1000);
      const now = new Date();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate, validity]);

  const TimeBlock = ({ value, label }) => (
    <div className="flex-1">
      <div className="relative">
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-2xl font-bold text-yellow-500">{value}</div>
          <div className="text-xs text-gray-400 mt-1">{label}</div>
        </div>
        <div className="absolute -inset-px bg-gradient-to-t from-yellow-500/10 to-transparent rounded-lg -z-10"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <TimeBlock value={timeLeft.days} label="Days" />
        <TimeBlock value={timeLeft.hours} label="Hours" />
        <TimeBlock value={timeLeft.minutes} label="Minutes" />
        <TimeBlock value={timeLeft.seconds} label="Seconds" />
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
        <div className="text-sm text-gray-400">Package Start Date</div>
        <div className="text-white font-medium mt-1">
          {new Date(startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="text-sm text-gray-400 mt-3">Validity</div>
        <div className="text-white font-medium mt-1">{validity} Days</div>
      </div>
    </div>
  );
};

export default PackageTimer;