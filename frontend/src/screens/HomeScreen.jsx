import React, { useState } from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Gym Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50 transform scale-105 hover:scale-100 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl font-extrabold text-white mb-6 tracking-tight">
            Welcome to <span className="text-yellow-500">Aura Fitness</span>
          </h1>
          <p className="text-2xl text-gray-200 mb-12 font-light">
            Your ultimate solution for managing gym memberships, classes, and
            trainers.
          </p>
          <a
            href="#"
            className="inline-block bg-yellow-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-yellow-600 transform hover:-translate-y-1 transition duration-300 ease-in-out"
          >
            Get Started
          </a>
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="relative bg-black py-24 px-6 sm:px-10 lg:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/4761345/pexels-photo-4761345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Experience the Best <span className="text-yellow-500">Training</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            Experience the best fitness environment with world-class equipment and
            expert trainers.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            "https://images.pexels.com/photos/28636774/pexels-photo-28636774/free-photo-of-man-adjusting-barbell-weights-in-gym.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/13893/people-training-muscles-gym-13893.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/1144864/pexels-photo-1144864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/12600542/pexels-photo-12600542.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/11433060/pexels-photo-11433060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/2628215/pexels-photo-2628215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          ].map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 transition duration-500 ease-in-out"
            >
              <img
                src={image}
                alt={`Gym Image ${index + 1}`}
                className="w-full h-96 object-cover transform group-hover:scale-110 transition duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition duration-500"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-bold text-white opacity-90 group-hover:opacity-100 transition duration-300">
                  
                </h3>
                <p className="text-gray-300 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-black py-24 px-6 sm:px-10 lg:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/27810159/pexels-photo-27810159/free-photo-of-a-barbell-on-the-floor-with-a-black-background.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

        <div className="relative max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Our <span className="text-yellow-500">Powerful</span> Features
          </h2>
          <p className="text-xl text-gray-300 font-light">
            The ultimate gym management solution to boost efficiency and enhance
            member experience.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Membership Management",
              desc: "Seamlessly manage memberships, renewals, and cancellations.",
              icon: "👤",
            },
            {
              title: "Class Scheduling",
              desc: "Organize and manage gym classes with real-time updates.",
              icon: "📆",
            },
            {
              title: "Trainer Management",
              desc: "Efficiently assign trainers and track their schedules.",
              icon: "🏋️‍♂️",
            },
            {
              title: "Workout Plans",
              desc: "Create customized fitness plans for members.",
              icon: "📝",
            },
            {
              title: "Billing & Payments",
              desc: "Automated and secure payment processing system.",
              icon: "💰",
            },
            {
              title: "Progress Tracking",
              desc: "Monitor and analyze fitness progress with insightful data.",
              icon: "📊",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-white/10 hover:border-yellow-500/50 transform hover:scale-105 hover:bg-white/10 transition duration-500 ease-in-out"
            >
              <div className="flex items-center justify-center text-6xl group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mt-6 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-black py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform With Us?
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light">
            Join with Aura Fitness to manage your daily workouts and gym operations.
          </p>
          <a
            href="register"
            className="inline-block bg-yellow-500 text-white font-bold py-4 px-10 rounded-full shadow-xl hover:bg-yellow-600 transform hover:-translate-y-1 transition duration-300 ease-in-out"
          >
            Sign Up Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;