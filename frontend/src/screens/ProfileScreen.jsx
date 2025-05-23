import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useUpdateUserMutation, useDeleteUserMutation } from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    userType: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { email, name, userType, mobile, password, confirmPassword, address } = formData;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setFormData({
      name: userInfo.name || '',
      email: userInfo.email || '',
      userType: userInfo.userType || '',
      mobile: userInfo.mobile || '',
      address: userInfo.address || '',
      password: '',
      confirmPassword: ''
    });
  }, [userInfo, navigate]);



  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      const updates = {
        name,
        email,
        mobile,
        address
      };
      
      if (password) {
        updates.password = password;
      }

      const res = await updateProfile(updates).unwrap();
      
      // Update Redux store with new user data
      dispatch(setCredentials({
        ...userInfo,
        ...res
      }));
      
      toast.success("Profile updated successfully");
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (err) {
      toast.error(
        err?.data?.message || 
        err?.error || 
        'An error occurred while updating profile'
      );
    }
  };

  const deleteAccountHandler = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await deleteUser().unwrap();
        dispatch(logout());
        navigate('/');
        toast.success("Your account has been deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-40"
      style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/pharmacist-standing-pharmacy-drugstore_1303-25542.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-4xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-blue-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">👨‍⚕️</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">Your Profile</h4>
        <p className="text-lg font-normal text-center text-blue-100/80 mb-8">
          Update your personal information
        </p>

        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">Full Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">User Type</label>
              <input
                type="text"
                value={userInfo.isAdmin ? "Admin" : userType}
                readOnly
                className="w-full px-4 py-3 bg-white/5 border border-blue-500/30 rounded-lg text-white/70 focus:outline-none transition-all cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">New Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Enter new password (optional)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-blue-100/80 text-sm">Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-500/30 rounded-lg text-white placeholder-blue-100/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>


          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-3xl mx-auto">
          <button
            type="submit"
            onClick={submitHandler}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            {isUpdating ? "Updating..." : "Update Profile"}
          </button>
          
          <button
            type="button"
            onClick={deleteAccountHandler}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-red-500/80 hover:bg-red-600/80 text-white rounded-lg font-semibold transition-all hover:shadow-lg"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>

        {(isUpdating || isDeleting) && <Loader />}
      </div>
    </div>
  );
};

export default ProfileScreen;