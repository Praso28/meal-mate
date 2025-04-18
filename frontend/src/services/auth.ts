import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'donor' | 'volunteer' | 'foodbank';
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Login a user
 * @param credentials - Login credentials
 * @returns Promise with auth response
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  // Store token and user in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
};

/**
 * Register a new user
 * @param data - Registration data
 * @returns Promise with auth response
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);

  // Store token and user in localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
};

/**
 * Logout the current user
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Get the current user from localStorage
 * @returns User object or null
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr || userStr === 'undefined') return null;

  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user from localStorage', error);
    localStorage.removeItem('user'); // Remove invalid data
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns boolean
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

/**
 * Update user profile
 * @param userData - Updated user data
 * @returns Promise with updated user
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put<{ success: boolean; user: User }>('/auth/profile', userData);

    // Extract user from response
    const updatedUserData = response.data.user;

    // Update user in localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return updatedUserData;
  } catch (error) {
    console.error('Error updating user profile:', error);

    // Update local storage anyway with the provided data
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    throw error; // Re-throw to be handled by the caller
  }
};

/**
 * Update user in local storage (for context updates without API calls)
 * @param userData - Updated user data
 * @returns Updated user
 */
export const updateLocalUser = (userData: User): User => {
  localStorage.setItem('user', JSON.stringify(userData));
  return userData;
};
