import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../slices/usersApiSlice'; // Ensure it's imported correctly
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation(); // Ensure mutation is imported
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      toast.success('Password reset link sent to your email!');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-12" style={{ backgroundImage: "url('https://example.com/image.jpg')" }}>
      <div className="relative w-full max-w-md px-8 py-12 m-4 backdrop-blur-sm bg-black/40 rounded-2xl shadow-2xl border border-yellow-500/20">
        <h4 className="text-4xl font-bold text-center text-white mt-10 mb-2">Forgot Password</h4>
        <p className="text-lg font-normal text-center text-yellow-100/80 mb-8">Enter your email address to receive a password reset link.</p>
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-1">
            <label className="text-yellow-100/80 text-sm">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-yellow-500/30 rounded-lg text-white placeholder-yellow-100/50 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full px-4 py-3 bg-transparent border border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-100/80 rounded-lg font-semibold transition-all"
          >
            Back to Login
          </button>
        </form>
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
