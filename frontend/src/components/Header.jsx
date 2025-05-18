import { useState, useEffect, useRef } from 'react';
import { FaSignInAlt, FaSignOutAlt, FaBars, FaTimes, FaUser, FaStore, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Add refs for click outside handling
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);

  const logoutHandler = async () => {
    try {
      const result = await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      toast.success(result.message || 'Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error(err?.data?.message || 'Logout failed');
      // If the error is due to no token, still clear the local state
      if (err?.status === 401) {
        dispatch(logout());
        navigate('/');
      }
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Handle clicks outside of dropdown and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = () => {
    if (userInfo) {
      if (userInfo.isAdmin) {
        navigate('/admin-dashboard');
      } else if (userInfo.userType === 'Trainer') {
        navigate('/trainer-dashboard');
      } else if (userInfo.userType === 'Member') {
        navigate('/member-dashboard');
      }
    } else {
      navigate('/');
    }
  };

  const ProfileDropdownItem = ({ icon: Icon, text, onClick }) => (
    <button 
      onClick={onClick} 
      className="flex items-center px-4 py-2 text-sm text-white hover:bg-blue-500/10 w-full text-left group"
    >
      <Icon className="mr-3 text-blue-500 group-hover:text-blue-400 transition-colors" />
      {text}
    </button>
  );

  return (
    <header className="bg-blue-600 border-b border-white/20 shadow-lg backdrop-blur-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6" ref={menuRef}>
        <button 
          onClick={handleNavigation} 
          className="text-white text-2xl font-bold focus:outline-none hover:text-blue-100 transition-colors"
        >
          MediCart
        </button>
        
        {/* Mobile Menu Button */}
        <button 
          className="text-white md:hidden focus:outline-none hover:text-blue-100 transition-colors" 
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Navigation Links */}
        {!userInfo?.isAdmin && (
          <div className={`md:flex md:items-center md:space-x-6 absolute md:relative top-full md:top-auto left-0 w-full md:w-auto bg-blue-600 md:bg-transparent transition-all duration-300 ease-in-out ${menuOpen ? 'block' : 'hidden md:flex'} z-40`}>
            <button onClick={() => { navigate('/'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-white hover:text-blue-100 hover:bg-blue-700/50 md:hover:bg-transparent transition-colors text-left">Home</button>
            <button onClick={() => { navigate('/products'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-white hover:text-blue-100 hover:bg-blue-700/50 md:hover:bg-transparent transition-colors text-left">Products</button>
            <button onClick={() => { navigate('/cart'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-white hover:text-blue-100 hover:bg-blue-700/50 md:hover:bg-transparent transition-colors text-left">Cart</button>
            <button onClick={() => { navigate('/orders'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-white hover:text-blue-100 hover:bg-blue-700/50 md:hover:bg-transparent transition-colors text-left">Orders</button>
            <button onClick={() => { navigate('/contact'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-white hover:text-blue-100 hover:bg-blue-700/50 md:hover:bg-transparent transition-colors text-left">Contact</button>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="text-white font-medium focus:outline-none hover:text-blue-100 transition-colors flex items-center" 
                  onClick={toggleDropdown}
                >
                  <span className="mr-2">{userInfo.name}</span>
                  <FaUser className="text-blue-200" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-blue-800/95 rounded-lg shadow-2xl z-50 border border-white/20 backdrop-blur-sm overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/20">
                      <p className="text-white font-medium">{userInfo.name}</p>
                      <p className="text-white/60 text-xs">{userInfo.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <ProfileDropdownItem 
                        icon={FaUser} 
                        text="View Profile" 
                        onClick={() => { navigate('/profile'); setDropdownOpen(false); }} 
                      />
                      {userInfo.userType === 'Member' && (
                        <>
                          <ProfileDropdownItem 
                            icon={FaChartLine} 
                            text="My Progress" 
                            onClick={() => { navigate('/pdisplay'); setDropdownOpen(false); }} 
                          />
                          <ProfileDropdownItem 
                            icon={FaCalendarAlt} 
                            text="My Schedule" 
                            onClick={() => { navigate('/myschedule'); setDropdownOpen(false); }} 
                          />
                          <ProfileDropdownItem 
                            icon={FaStore} 
                            text="Store" 
                            onClick={() => { navigate('/store'); setDropdownOpen(false); }} 
                          />
                          <ProfileDropdownItem 
                            icon={FaChartLine} 
                            text="Feedback" 
                            onClick={() => { navigate('/feedback'); setDropdownOpen(false); }} 
                          />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={logoutHandler}
                className="text-white hover:text-blue-100 transition-colors flex items-center space-x-2 bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded-lg text-sm"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="text-white text-sm flex items-center hover:text-blue-100 transition-colors"
              >
                <FaSignInAlt className="mr-1" /> Sign In
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="text-white text-sm flex items-center hover:text-blue-100 transition-colors"
              >
                <FaSignOutAlt className="mr-1" /> Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;