import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin-dashboard');
      } else if (userInfo.userType === 'Pharmacist') {
        navigate('/pharmacist-dashboard');
      } else if (userInfo.userType === 'Customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));

      if (res.isAdmin) {
        navigate('/admin-dashboard');
      } else if (res.userType === 'Pharmacist') {
        navigate('/pharmacist-dashboard');
      } else if (res.userType === 'Customer') {
        navigate('/customer-dashboard');
      } else {
        navigate('/');
      }

      toast.success('Login Successful!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="relative w-full max-w-md px-8 py-12 m-4 bg-white rounded-2xl shadow-xl">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">💊</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-gray-800 mt-10 mb-2">
          Welcome Back to MediCart
        </h4>
        <p className="text-lg font-normal text-center text-gray-600 mb-8">
          Enter your credentials to continue
        </p>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 px-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white font-medium text-lg shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {isLoading && <Loader />}

        <div className="mt-8 space-y-4">
          <p className="text-center text-gray-600">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </p>

          <p className="text-center text-gray-600">
            New to MediCart?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
