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
        navigate('/dashboard');
      } else if (userInfo.userType === 'Trainer') {
        navigate('/trainer-dashboard');
      } else if (userInfo.userType === 'Member') {
        navigate('/member-dashboard');
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
      } else if (res.userType === 'Trainer') {
        navigate('/trainer-dashboard');
      } else if (res.userType === 'Member') {
        navigate('/member-dashboard');
      } else {
        navigate('/');
      }

      toast.success('Login Successful!');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://www.officeh2o.com/wp-content/uploads/2023/10/man-working-out-in-the-gym-to-lose-weight.png')",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlend: 'overlay'
      }}
    >
      <div className="relative w-full max-w-md px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
          <div className="w-28 h-28 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white">💪</span>
          </div>
        </div>

        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">Welcome Back</h4>
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">
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
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
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
                className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 px-6 text-center bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-yellow-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {isLoading && <Loader />}

        <div className="mt-8 space-y-4">
          <p className="text-center text-white">
            <Link to="/forgot-password" className="text-yellow-400 hover:text-yellow-300 underline decoration-2 underline-offset-4 font-medium transition-colors">
              Forgot Password?
            </Link>
          </p>

          <p className="text-center text-white">
            New to our gym?{' '}
            <Link to="/register" className="text-yellow-400 hover:text-yellow-300 underline decoration-2 underline-offset-4 font-medium transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;