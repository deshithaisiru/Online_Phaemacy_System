import React from "react";

const HeroSection = () => {
  return (
    <div className="relative bg-gray-800 text-white py-16 px-4 lg:px-20">
      <div className="absolute inset-0">
        <img
          src="https://sportsmedicine.mayoclinic.org/wp-content/uploads/2020/12/weight-training-blog-banner.jpg" // Replace with a relevant URL
          alt="Welcome to Aura Fitness"
          className="w-full h-full object-cover opacity-50"
        />
      </div>
      <div className="relative text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Aura Fitness</h1>
        <p className="text-lg mb-6">
          We are a community of people who believe in the power of movement to
          change lives.
        </p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
