import api from './api';

export interface DashboardStats {
  totalDonations: number;
  pendingDonations: number;
  completedDonations: number;
  assignedVolunteers: number;
  totalUsers?: number;
  activeVolunteers?: number;
  foodBanks?: number;
  inventoryItems?: number;
  incomingDonations?: number;
  lowStockItems?: number;
  storageCapacity?: number;
  userAssignments?: number;
  completedPickups?: number;
  availableDonations?: number;
}

export interface DonationTrend {
  month: string; // Format: YYYY-MM
  count: number;
}

/**
 * Get dashboard statistics based on user role
 * @returns Promise with dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

/**
 * Get admin dashboard statistics
 * @returns Promise with admin dashboard statistics
 */
export const getAdminDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/admin/stats');
  return response.data;
};

/**
 * Get donor dashboard statistics
 * @returns Promise with donor dashboard statistics
 */
export const getDonorDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/donations/stats');
  return response.data;
};

/**
 * Get volunteer dashboard statistics
 * @returns Promise with volunteer dashboard statistics
 */
export const getVolunteerDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/volunteer-assignments/stats');
  return response.data;
};

/**
 * Get foodbank dashboard statistics
 * @returns Promise with foodbank dashboard statistics
 */
export const getFoodbankDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStats>('/foodbanks/stats');
  return response.data;
};

/**
 * Get foodbank donation trends
 * @returns Promise with donation trends data
 */
export const getFoodbankDonationTrends = async (): Promise<DonationTrend[]> => {
  const response = await api.get<DonationTrend[]>('/foodbanks/donation-trends');
  return response.data;
};
