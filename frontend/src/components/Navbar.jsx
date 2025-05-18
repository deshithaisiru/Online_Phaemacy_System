import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="self-center text-xl font-semibold whitespace-nowrap">
            Pharmacy POS - Employee Management
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
