import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/NewFooter';

const App = () => {
  console.log("App component rendering");
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <Header />
      <main className="flex-grow mt-16 mb-8">
        <Outlet /> {/* This is crucial for nested routes to render */}
      </main>
      <Footer />
    </div>
  );
};

export default App;