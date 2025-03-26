import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" />
        </div>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Welcome to MediCart</h1>
            <p className="text-xl text-blue-100">Your trusted healthcare companion</p>
            <Link
              to="/login"
              className="inline-block mt-8 bg-blue-700 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              image: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg",
              title: "Professional Pharmacists",
              description: "Expert pharmacists ready to assist you",
              icon: "👨‍⚕️"
            },
            {
              image: "https://images.pexels.com/photos/3683089/pexels-photo-3683089.jpeg",
              title: "Modern Medicine Storage",
              description: "State-of-the-art storage facilities",
              icon: "💊"
            },
            {
              image: "https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg",
              title: "Quality Medications",
              description: "Genuine medicines from trusted sources",
              icon: "✨"
            },
            {
              image: "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg",
              title: "Home Delivery",
              description: "Swift and secure medication delivery",
              icon: "🚚"
            }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-white/95 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 py-24 px-6 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3')] bg-cover bg-center opacity-10" />

        <div className="relative max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            Our <span className="text-blue-200">Powerful</span> Features
          </h2>
          <p className="text-xl text-blue-100 font-light">
            Discover features that make MediCart your ideal online pharmacy.
          </p>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Order Medicines",
              desc: "Easily order prescription and over-the-counter medications.",
              icon: "💊",
            },
            {
              title: "Track Your Orders",
              desc: "Real-time tracking of your pharmacy orders.",
              icon: "📦",
            },
            {
              title: "Health Consultations",
              desc: "Consult with certified pharmacists for advice.",
              icon: "🩺",
            },
            {
              title: "Prescription Upload",
              desc: "Upload prescriptions for quick processing.",
              icon: "📄",
            },
            {
              title: "Secure Payments",
              desc: "Fast and secure payment options for your convenience.",
              icon: "💳",
            },
            {
              title: "Fast Delivery",
              desc: "Get your medications delivered right to your doorstep.",
              icon: "🚚",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl shadow-lg mb-6 mx-auto group-hover:scale-110 transition duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-24 px-6">
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Get Your Medicines?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Join MediCart today and get your prescriptions and medications delivered at your convenience.
          </p>
          <Link
            to="/register"
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-medium py-4 px-10 rounded-lg shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
