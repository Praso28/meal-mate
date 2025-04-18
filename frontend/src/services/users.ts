import api from './api';
import { User } from './auth';

export interface UserCreateData {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_active?: boolean;
}

/**
 * Get all users
 * @returns Promise with users array
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/admin/users');
  return response.data;
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise with user
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/admin/users/${id}`);
  return response.data;
};

/**
 * Create a new user
 * @param userData - User data
 * @returns Promise with created user
 */
export const createUser = async (userData: UserCreateData): Promise<User> => {
  const response = await api.post<User>('/admin/users', userData);
  return response.data;
};

/**
 * Update a user
 * @param id - User ID
 * @param userData - Updated user data
 * @returns Promise with updated user
 */
export const updateUser = async (id: number, userData: UserUpdateData): Promise<User> => {
  const response = await api.put<User>(`/admin/users/${id}`, userData);
  return response.data;
};

/**
 * Delete a user
 * @param id - User ID
 * @returns Promise with success message
 */
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/admin/users/${id}`);
  return response.data;
};

/**
 * Get all foodbanks
 * @returns Promise with foodbanks array
 */
export const getAllFoodbanks = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users/foodbanks');
  return response.data;
};
