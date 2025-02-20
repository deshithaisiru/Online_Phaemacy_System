import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PackageFeedbackView = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [packageNames, setPackageNames] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFeedback, setEditingFeedback] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchFeedbacks();
  }, [userInfo.token, selectedPackage]);

  const fetchFeedbacks = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      let url = '/api/by-package';
      if (selectedPackage) {
        url += `?pName=${encodeURIComponent(selectedPackage)}`;
      }
      const response = await axios.get(url, config);
      setFeedbacks(response.data.response);

      if (packageNames.length === 0) {
        const uniquePackageNames = [...new Set(response.data.response.map(feedback => feedback.pName))];
        setPackageNames(uniquePackageNames);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch feedbacks');
      setLoading(false);
    }
  };

  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value);
  };

  const handleUpdateClick = (feedback) => {
    setEditingFeedback({ ...feedback });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      // Include cusEmail in the update request
      const updateData = {
        ...editingFeedback,
        cusEmail: userInfo.email
      };
      
      await axios.post(
        '/api/update-package-feedback',
        updateData,
        config
      );
      
      await fetchFeedbacks();
      setEditingFeedback(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update feedback');
    }
  };

  const handleInputChange = (e) => {
    setEditingFeedback({ ...editingFeedback, [e.target.name]: e.target.value });
  };

  const handleDeleteClick = async (pfID) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        
        // Include cusEmail in the delete request
        await axios.post(
          '/api/delete-package-feedback', 
          { 
            pfID,
            cusEmail: userInfo.email 
          },
          config
        );
        
        await fetchFeedbacks();
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete feedback');
      }
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Package Feedback View</h1>
      
      <div className="mb-6">
        <label htmlFor="packageSelect" className="block mb-2 font-semibold">Filter by Package:</label>
        <select
          id="packageSelect"
          value={selectedPackage}
          onChange={handlePackageChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Packages</option>
          {packageNames.map((pName) => (
            <option key={pName} value={pName}>{pName}</option>
          ))}
        </select>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedbacks.map((feedback) => (
          <div key={feedback.pfID} className="bg-white p-6 rounded-lg shadow-md">
            {editingFeedback && editingFeedback.pfID === feedback.pfID ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1">Rating</label>
                  <input
                    type="number"
                    name="pfRate"
                    min="1"
                    max="5"
                    value={editingFeedback.pfRate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Feedback</label>
                  <textarea
                    name="pfNote"
                    value={editingFeedback.pfNote}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                  />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFeedback(null)}
                  className="bg-gray-300 text-black px-4 py-2 rounded ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">{feedback.pName}</h2>
                <p className="text-gray-600 mb-2">Customer: {feedback.cusName}</p>
                <p className="text-gray-600 mb-2">Email: {feedback.cusEmail}</p>
                <p className="text-gray-600 mb-2">Type: {feedback.pfType}</p>
                <p className="text-gray-600 mb-2">Rating: {feedback.pfRate}/5</p>
                <p className="text-gray-600 mb-2">Date: {new Date(feedback.pfDate).toLocaleDateString()}</p>
                <p className="text-gray-700 mt-4">{feedback.pfNote}</p>
                {userInfo.email === feedback.cusEmail && (
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleUpdateClick(feedback)}
                      className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteClick(feedback.pfID)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      
      {feedbacks.length === 0 && (
        <p className="text-center py-4 text-gray-500">No feedbacks found for the selected package.</p>
      )}
    </div>
  );
};

export default PackageFeedbackView;