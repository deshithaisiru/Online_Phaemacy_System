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
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
      toast.success('Logout successful!');
    } catch (err) {
      console.error(err);
      toast.error('Logout failed');
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
        navigate('/dashboard');
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
      className="flex items-center px-4 py-2 text-sm text-yellow-100/80 hover:bg-yellow-500/10 w-full text-left group"
    >
      <Icon className="mr-3 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
      {text}
    </button>
  );

  return (
    <header className="bg-black/90 border-b border-yellow-500/20 shadow-lg backdrop-blur-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6" ref={menuRef}>
        <button 
          onClick={handleNavigation} 
          className="text-yellow-500 text-2xl font-bold focus:outline-none hover:text-yellow-400 transition-colors"
        >
          Aura Fitness
        </button>
        
        {/* Mobile Menu Button */}
        <button 
          className="text-yellow-500 md:hidden focus:outline-none hover:text-yellow-400 transition-colors" 
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Navigation Links */}
        {!userInfo?.isAdmin && (
          <div className={`md:flex md:items-center md:space-x-6 absolute md:relative top-full md:top-auto left-0 w-full md:w-auto bg-black/90 md:bg-transparent transition-all duration-300 ease-in-out ${menuOpen ? 'block' : 'hidden md:flex'} z-40`}>
            <button onClick={() => { navigate('/'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-yellow-100/80 hover:text-yellow-500 hover:bg-yellow-500/10 md:hover:bg-transparent transition-colors text-left">Home</button>
            <button onClick={() => { navigate('/classes'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-yellow-100/80 hover:text-yellow-500 hover:bg-yellow-500/10 md:hover:bg-transparent transition-colors text-left">Classes</button>
            <button onClick={() => { navigate('/trainers'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-yellow-100/80 hover:text-yellow-500 hover:bg-yellow-500/10 md:hover:bg-transparent transition-colors text-left">Trainers</button>
            <button onClick={() => { navigate('/membership'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-yellow-100/80 hover:text-yellow-500 hover:bg-yellow-500/10 md:hover:bg-transparent transition-colors text-left">Membership</button>
            <button onClick={() => { navigate('/contact'); setMenuOpen(false); }} className="block w-full md:w-auto px-6 md:px-0 py-3 md:py-0 text-yellow-100/80 hover:text-yellow-500 hover:bg-yellow-500/10 md:hover:bg-transparent transition-colors text-left">Contact</button>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {userInfo ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                className="text-yellow-100/80 font-medium focus:outline-none hover:text-yellow-500 transition-colors flex items-center" 
                onClick={toggleDropdown}
              >
                {userInfo.name}
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && userInfo.userType === 'Member' && (
                <div className="absolute right-0 mt-2 w-56 bg-black/95 rounded-lg shadow-2xl z-50 border border-yellow-500/20 backdrop-blur-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-yellow-500/20 flex items-center">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-yellow-100/90 font-medium">{userInfo.name}</p>
                      <p className="text-yellow-100/60 text-xs">{userInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <ProfileDropdownItem 
                      icon={FaUser} 
                      text="Profile" 
                      onClick={() => { navigate('/profile'); setDropdownOpen(false); }} 
                    />
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
                  </div>
                  
                  <div className="border-t border-yellow-500/20 py-1">
                    <ProfileDropdownItem 
                      icon={FaSignOutAlt} 
                      text="Logout" 
                      onClick={() => { logoutHandler(); setDropdownOpen(false); }} 
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')} 
                className="text-yellow-100/80 text-sm flex items-center hover:text-yellow-500 transition-colors"
              >
                <FaSignInAlt className="mr-1" /> Sign In
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="text-yellow-100/80 text-sm flex items-center hover:text-yellow-500 transition-colors"
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