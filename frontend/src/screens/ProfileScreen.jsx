import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useUpdateUserMutation, useDeleteUserMutation } from "../slices/usersApiSlice";
import { setCredentials, logout } from "../slices/authSlice";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("");
  const [mobile, setMobile] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [age, setAge] = useState(null);
  const [address, setAddress] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setUserType(userInfo.userType);
    setMobile(userInfo.mobile);
    setHeight(userInfo.height);
    setWeight(userInfo.weight);
    setAddress(userInfo.address);
    setBirthday(userInfo.birthday);
    if (userInfo.birthday) {
      calculateAge(userInfo.birthday);
    }
  }, [userInfo]);

  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);

      let category = "";
      if (bmiValue < 18.5) {
        category = "Underweight";
      } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
        category = "Normal weight";
      } else if (bmiValue >= 25 && bmiValue <= 29.9) {
        category = "Overweight";
      } else {
        category = "Obesity";
      }
      setBmiCategory(category);
    } else {
      setBmi(null);
      setBmiCategory("");
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    setAge(age);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          userType,
          mobile,
          height,
          weight,
          birthday,
          password,
          address,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
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
        backgroundImage: "url('https://www.health.com/thmb/dqUTTgNgfLBbUnQGzKYo7KNQ7pU=/2119x0/filters:no_upscale():max_bytes(150000):strip_icc()/BuildMuscleLoseFat-98e3bb453daf4049aeb72b3841ca2d0a.jpg')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-4xl px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">👤</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">Your Profile</h4>
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">
          Update your personal information
        </p>

        <form onSubmit={submitHandler} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Mobile Number</label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">User Type</label>
              <input
                type="text"
                value={userInfo.isAdmin ? "Admin" : userType}
                readOnly
                className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white/70 focus:outline-none transition-all cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                placeholder="Enter new password (optional)"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Birthday</label>
              <input
                type="date"
                value={birthday ? birthday.split("T")[0] : ""}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  calculateAge(e.target.value);
                }}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-yellow-100/80 text-sm">Age</label>
              <input
                type="text"
                value={age !== null ? age : ""}
                readOnly
                className="w-full px-4 py-3 bg-white/5 border border-yellow-500/30 rounded-lg text-white/70 focus:outline-none transition-all cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              onClick={calculateBMI}
              className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
            >
              Calculate BMI
            </button>

            {bmi && (
              <div className="p-4 bg-white/10 rounded-lg border border-yellow-500/30">
                <p className="text-white mb-1">BMI: <span className="text-yellow-400 font-semibold">{bmi}</span></p>
                <p className="text-white">Category: <span className="text-yellow-400 font-semibold">{bmiCategory}</span></p>
              </div>
            )}
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 max-w-3xl mx-auto">
          <button
            type="submit"
            onClick={submitHandler}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30"
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