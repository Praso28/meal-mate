import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { format } from 'date-fns';

const NotificationDropdown: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllAsRead();
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-1 rounded-full text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
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
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                {notifications && notifications.some(n => !n.is_read) && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-orange-600 hover:text-orange-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto">
              {!notifications || notifications.length === 0 ? (
                <div key="no-notifications" className="px-4 py-3 text-sm text-gray-500 text-center">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 ${
                      !notification.is_read ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        {notification.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                    {!notification.is_read && (
                      <button
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        className="mt-2 text-xs text-orange-600 hover:text-orange-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
