import api from './api';

export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

/**
 * Get all volunteers for assignment
 * @returns Promise with volunteers array
 */
export const getVolunteers = async (): Promise<Volunteer[]> => {
  const response = await api.get<Volunteer[]>('/foodbanks/volunteers');
  return response.data;
};

/**
 * Get foodbank donation trends
 * @returns Promise with donation trends data
 */
export const getFoodbankDonationTrends = async (): Promise<any[]> => {
  const response = await api.get<any[]>('/foodbanks/donation-trends');
  return response.data;
};
