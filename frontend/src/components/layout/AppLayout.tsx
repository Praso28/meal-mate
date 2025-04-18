import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Sidebar from './Sidebar';
import NotificationDropdown from '../notifications/NotificationDropdown';

const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={toggleSidebar}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 md:hidden"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/dashboard" className="text-2xl font-bold text-orange-600">
                    MealMate
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  <NotificationDropdown />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex items-center md:ml-6">
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <span className="hidden md:block mr-2 text-sm font-medium text-gray-700">
                        {user?.name}
                      </span>
                      <button
                        onClick={handleLogout}
                        className="ml-2 px-3 py-1 text-sm text-white bg-orange-500 hover:bg-orange-600 rounded-md"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-100">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
