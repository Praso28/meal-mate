import api from './api';

export interface Donation {
  id: number;
  donor_id: number;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip_code: string;
  pickup_instructions: string;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end: string;
  status: 'pending' | 'assigned' | 'in_transit' | 'completed' | 'cancelled';
  volunteer_id?: number;
  foodbank_id?: number;
  created_at: string;
  updated_at: string;
  categories?: number[];
}

export interface DonationFormData {
  title: string;
  description: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  pickup_address: string;
  pickup_city: string;
  pickup_state: string;
  pickup_zip_code: string;
  pickup_instructions: string;
  pickup_date: string;
  pickup_time_start: string;
  pickup_time_end: string;
  categories?: number[];
  volunteer_id?: number;
  foodbank_id?: number;
  status?: string;
}

/**
 * Get all donations
 * @param status - Optional status filter
 * @returns Promise with donations array
 */
export const getDonations = async (status?: string): Promise<Donation[]> => {
  const params = status ? { status } : {};
  const response = await api.get<Donation[]>('/donations', { params });
  return response.data;
};

/**
 * Get a donation by ID
 * @param id - Donation ID
 * @returns Promise with donation
 */
export const getDonationById = async (id: number): Promise<Donation> => {
  const response = await api.get<Donation>(`/donations/${id}`);
  return response.data;
};

/**
 * Create a new donation
 * @param data - Donation data
 * @returns Promise with created donation
 */
export const createDonation = async (data: DonationFormData): Promise<Donation> => {
  const response = await api.post<Donation>('/donations', data);
  return response.data;
};

/**
 * Update a donation
 * @param id - Donation ID
 * @param data - Updated donation data
 * @returns Promise with updated donation
 */
export const updateDonation = async (id: number, data: Partial<DonationFormData>): Promise<Donation> => {
  const response = await api.put<Donation>(`/donations/${id}`, data);
  return response.data;
};

/**
 * Delete a donation
 * @param id - Donation ID
 * @returns Promise with success message
 */
export const deleteDonation = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/donations/${id}`);
  return response.data;
};

/**
 * Assign a volunteer to a donation
 * @param id - Donation ID
 * @returns Promise with updated donation
 */
export const assignVolunteer = async (id: number, volunteerId?: number): Promise<Donation> => {
  const response = await api.post<Donation>(`/donations/${id}/assign`, { volunteer_id: volunteerId || 3 });
  return response.data;
};

/**
 * Mark a donation as completed
 * @param id - Donation ID
 * @returns Promise with updated donation
 */
export const completeDonation = async (id: number): Promise<Donation> => {
  const response = await api.post<Donation>(`/donations/${id}/complete`);
  return response.data;
};

/**
 * Get volunteer assignments
 * @returns Promise with donations array
 */
export const getVolunteerAssignments = async (): Promise<Donation[]> => {
  const response = await api.get<Donation[]>('/volunteer-assignments');
  return response.data;
};

/**
 * Update donation status
 * @param id - Donation ID
 * @param status - New status
 * @returns Promise with updated donation
 */
export const updateDonationStatus = async (id: number, status: string): Promise<Donation> => {
  try {
    const response = await api.put<Donation>(`/donations/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating donation status:', error);
    throw error;
  }
};
