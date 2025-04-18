import api from './api';

export interface InventoryItem {
  id: number;
  foodbank_id: number;
  category_id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  minimum_stock_level: number;
  maximum_stock_level: number;
  storage_location: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryFormData {
  category_id: number;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  minimum_stock_level: number;
  maximum_stock_level: number;
  storage_location: string;
}

/**
 * Get all inventory items
 * @returns Promise with inventory items array
 */
export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  const response = await api.get<{ data: InventoryItem[] }>('/inventory');
  return response.data.data;
};

/**
 * Get an inventory item by ID
 * @param id - Inventory item ID
 * @returns Promise with inventory item
 */
export const getInventoryItemById = async (id: number): Promise<InventoryItem> => {
  const response = await api.get<{ data: InventoryItem }>(`/inventory/${id}`);
  return response.data.data;
};

/**
 * Create a new inventory item
 * @param data - Inventory item data
 * @returns Promise with created inventory item
 */
export const createInventoryItem = async (data: InventoryFormData): Promise<InventoryItem> => {
  const response = await api.post<{ data: InventoryItem }>('/inventory', data);
  return response.data.data;
};

/**
 * Update an inventory item
 * @param id - Inventory item ID
 * @param data - Updated inventory item data
 * @returns Promise with updated inventory item
 */
export const updateInventoryItem = async (id: number, data: Partial<InventoryFormData>): Promise<InventoryItem> => {
  const response = await api.put<{ data: InventoryItem }>(`/inventory/${id}`, data);
  return response.data.data;
};

/**
 * Delete an inventory item
 * @param id - Inventory item ID
 * @returns Promise with success status
 */
export const deleteInventoryItem = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/inventory/${id}`);
  return response.data;
};
