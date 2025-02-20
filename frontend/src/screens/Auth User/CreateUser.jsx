import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../components/input';
import { Checkbox } from '../../components/checkbox';
import { Button } from '../../components/button';

const CreateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    mobile: '',
    height: '',
    weight: '',
    birthday: '',
    address: '',
    isAdmin: false,
  });
  const [error, setError] = useState('');
  const [age, setAge] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'birthday') {
      const formattedDate = value ? new Date(value).toISOString().split('T')[0] : '';
      setUser({ ...user, [name]: formattedDate });
      
      if (value) {
        const birthDate = new Date(value);
        const calculatedAge = new Date().getFullYear() - birthDate.getFullYear();
        const monthDiff = new Date().getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && new Date().getDate() < birthDate.getDate())) {
          setAge(calculatedAge - 1);
        } else {
          setAge(calculatedAge);
        }
      } else {
        setAge('');
      }
    } else {
      setUser({ ...user, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (user.password !== user.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { confirmPassword, ...userWithoutConfirmPassword } = user;
      await axios.post('/api/users/create', userWithoutConfirmPassword);
      navigate('/admin-dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while creating the user.');
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-28"
      style={{
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-4xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">➕</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">
          Create New Client
        </h4>
        
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">
          Add a new client to the Gym Management System
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-100 px-4 py-3 rounded-lg mb-6">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Name</label>
            <Input
              type="text"
              placeholder="Enter name"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Email</label>
            <Input
              type="email"
              placeholder="Enter email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Password</label>
            <Input
              type="password"
              placeholder="Enter password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Confirm Password</label>
            <Input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">User Type</label>
            <select
              name="userType"
              value={user.userType}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            >
              <option value="" className="bg-gray-800">Select User Type</option>
              <option value="Member" className="bg-gray-800">Member</option>
              <option value="Trainer" className="bg-gray-800">Trainer</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Mobile Number</label>
            <Input
              type="tel"
              placeholder="Mobile Number"
              name="mobile"
              value={user.mobile}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Height (cm)</label>
            <Input
              type="number"
              placeholder="Enter height (cm)"
              name="height"
              value={user.height}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Weight (kg)</label>
            <Input
              type="number"
              placeholder="Enter weight (kg)"
              name="weight"
              value={user.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Address</label>
            <Input
              type="text"
              placeholder="Enter Address"
              name="address"
              value={user.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Birthday</label>
            <Input
              type="date"
              name="birthday"
              value={user.birthday}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
            {age && <p className="text-yellow-100/80 mt-1 text-sm">Age: {age} years</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAdmin"
              name="isAdmin"
              checked={user.isAdmin}
              onChange={handleChange}
              className="border-yellow-500/30 text-yellow-500 focus:ring-yellow-500"
            />
            <label htmlFor="isAdmin" className="text-yellow-100/80">Is Admin</label>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
          >
            Create User
          </button>
          <button
            onClick={() => navigate('/admin-dashboard')}
            className="w-full px-4 py-3 bg-transparent border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-100/80 rounded-lg font-semibold transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;