import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/button';

const DeleteUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`/api/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.message === 'User removed') {
        navigate('/admin-dashboard');
      } else {
        setError('Unexpected response from server');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12"
      style={{
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'overlay'
      }}
    >
      <div className="relative w-full max-w-md px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">⚠️</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">
          Delete User
        </h4>
        
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleDelete} 
            disabled={loading}
            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Confirm Delete'}
          </Button>

          <Button 
            onClick={() => navigate('/admin-dashboard')}
            className="w-full px-4 py-3 bg-transparent border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-100/80 rounded-lg font-semibold transition-all"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
