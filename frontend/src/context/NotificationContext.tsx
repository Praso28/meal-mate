import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { getNotifications, markAsRead, markAllAsRead as markAllAsReadService } from '../services/notifications';
import { io, Socket } from 'socket.io-client';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markNotificationAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        // Connect to socket server
        // Remove '/api' from the URL for Socket.IO connection
        const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace('/api', '');

        // Create socket instance with error handling
        const socketInstance = io(socketUrl, {
          reconnectionAttempts: 3,
          timeout: 10000,
          transports: ['polling', 'websocket'],
          path: '/socket.io/',
          autoConnect: false, // Don't connect automatically
          reconnection: true,
          reconnectionDelay: 5000
        });

        // Set up event handlers before connecting
        socketInstance.on('connect', () => {
          console.log('Socket connected successfully');
          // Join user-specific room
          socketInstance.emit('join', { id: user.id, role: user.role });
        });

        // Listen for new notifications
        socketInstance.on('notification', (notification: Notification) => {
          setNotifications(prev => prev ? [notification, ...prev] : [notification]);

          // Show toast for new notification
          showToast(
            notification.type as 'success' | 'error' | 'info',
            notification.message
          );
        });

        // Handle connection errors
        socketInstance.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          // Don't show error to user as it's not critical
        });

        socketInstance.on('error', (err) => {
          console.error('Socket error:', err);
        });

        socketInstance.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });

        // Now connect
        socketInstance.connect();
        setSocket(socketInstance);

        // Cleanup on unmount
        return () => {
          if (socketInstance.connected) {
            socketInstance.disconnect();
          }
        };
      } catch (error) {
        console.error('Failed to initialize socket connection:', error);
      }
    }
  }, [isAuthenticated, user]);

  // Fetch notifications on auth change
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Set empty notifications to avoid undefined errors
      setNotifications([]);
      // Don't show error to user as it's not critical
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      if (notifications) {
        setNotifications(notifications.map(notification =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        ));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Update the UI anyway to provide a better user experience
      if (notifications) {
        setNotifications(notifications.map(notification =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        ));
      }
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllAsReadService();
      if (notifications) {
        setNotifications(notifications.map(notification => ({
          ...notification,
          is_read: true
        })));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      // Update the UI anyway to provide a better user experience
      if (notifications) {
        setNotifications(notifications.map(notification => ({
          ...notification,
          is_read: true
        })));
      }
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
      default:
        toast(message);
        break;
    }
  };

  const unreadCount = notifications ? notifications.filter(n => !n.is_read).length : 0;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllAsRead,
        showToast
      }}
    >
      <Toaster position="top-right" />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
