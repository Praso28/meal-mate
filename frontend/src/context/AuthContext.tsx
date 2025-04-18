import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, login as loginApi, register as registerApi, logout as logoutApi, updateLocalUser, LoginCredentials, RegisterData } from '../services/auth';

// Import AuthResponse type
import { AuthResponse } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse | void>;
  register: (data: RegisterData) => Promise<AuthResponse | void>;
  logout: () => void;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await loginApi(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      // Re-throw the error so it can be caught by the component
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await registerApi(data);
      setUser(response.user);
      return response;
    } catch (error) {
      // Re-throw the error so it can be caught by the component
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  const updateUser = (userData: User) => {
    // Update user in local storage
    updateLocalUser(userData);
    // Update user in state
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
