import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, LogOut, User } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [notificationCount, setNotificationCount] = React.useState(3);
  
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={onToggleSidebar}
              className="text-gray-500 focus:outline-none focus:text-gray-600 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <span className="text-xl font-bold text-blue-600">PharmaConnect</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none"
                aria-expanded={showProfileMenu}
                aria-haspopup="true"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium">{user?.name || 'User'}</span>
              </button>
              
              {showProfileMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="py-1" role="none">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => navigate('/profile')}
                    >
                      Your Profile
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => navigate('/settings')}
                    >
                      Settings
                    </button>
                    <button 
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;