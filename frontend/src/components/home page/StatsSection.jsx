import React from "react";

const stats = [
  { label: "Members", value: "2,500+" },
  { label: "Classes", value: "100+" },
  { label: "Trainers", value: "75+" },
  { label: "Events", value: "1,000+" },
];

const StatsSection = () => {
  return (
    <div className="py-12 px-4 lg:px-20 bg-gray-800 text-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900 p-6 rounded-lg">
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;
