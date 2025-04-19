import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { createDonation, DonationFormData } from '../../services/donations';
import { getAllFoodbanks } from '../../services/users';

interface FoodCategory {
  id: number;
  name: string;
}

interface Foodbank {
  id: number;
  name: string;
  email: string;
}

const CreateDonation: React.FC = () => {
  const [formData, setFormData] = useState<DonationFormData>({
    title: '',
    description: '',
    quantity: 1,
    unit: 'kg',
    expiry_date: '',
    pickup_address: '',
    pickup_city: '',
    pickup_state: '',
    pickup_zip_code: '',
    pickup_instructions: '',
    pickup_date: '',
    pickup_time_start: '',
    pickup_time_end: '',
    categories: [],
    foodbank_id: undefined
  });

  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [foodbanks, setFoodbanks] = useState<Foodbank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useNotifications();

  useEffect(() => {
    // In a real app, we would fetch categories from the API
    // For now, we'll use mock data
    setCategories([
      { id: 1, name: 'Fruits' },
      { id: 2, name: 'Vegetables' },
      { id: 3, name: 'Grains' },
      { id: 4, name: 'Protein' },
      { id: 5, name: 'Dairy' },
      { id: 6, name: 'Canned Goods' },
      { id: 7, name: 'Dry Goods' },
      { id: 8, name: 'Beverages' },
      { id: 9, name: 'Snacks' },
      { id: 10, name: 'Condiments' },
      { id: 11, name: 'Baby Food' },
      { id: 12, name: 'Other' }
    ]);

    // Fetch foodbanks from the API
    const fetchFoodbanks = async () => {
      try {
        // For now, we'll use mock foodbanks data
        setFoodbanks([
          { id: 4, name: 'Community Food Bank', email: 'foodbank@example.com' },
          { id: 5, name: 'City Food Bank', email: 'cityfoodbank@example.com' }
        ]);

        // Set default foodbank
        setFormData(prev => ({
          ...prev,
          foodbank_id: 4 // Default to the first foodbank
        }));
      } catch (error) {
        console.error('Error fetching foodbanks:', error);
        showToast('error', 'Failed to load foodbanks');
      }
    };

    fetchFoodbanks();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value);

    if (checked) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories || [], categoryId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        categories: prev.categories?.filter(id => id !== categoryId) || []
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title) throw new Error('Title is required');
      if (!formData.pickup_address) throw new Error('Pickup address is required');
      if (!formData.pickup_city) throw new Error('Pickup city is required');
      if (!formData.pickup_state) throw new Error('Pickup state is required');
      if (!formData.pickup_zip_code) throw new Error('Pickup zip code is required');
      if (!formData.pickup_date) throw new Error('Pickup date is required');
      if (!formData.pickup_time_start) throw new Error('Pickup start time is required');
      if (!formData.pickup_time_end) throw new Error('Pickup end time is required');

      // Format the data before sending
      const formattedData = {
        ...formData,
        // Ensure quantity is a number
        quantity: Number(formData.quantity),
        // Ensure foodbank_id is a number
        foodbank_id: formData.foodbank_id ? Number(formData.foodbank_id) : undefined,
        // Ensure categories is an array (even if empty)
        categories: formData.categories || [],
        // Set default values for optional fields
        description: formData.description || '',
        expiry_date: formData.expiry_date || null,
        pickup_instructions: formData.pickup_instructions || ''
      };

      console.log('Submitting donation with formatted data:', formattedData);
      await createDonation(formattedData);
      showToast('success', 'Donation created successfully');
      navigate('/donations');
    } catch (error: any) {
      console.error('Error in handleSubmit:', error);
      if (error.message) {
        showToast('error', error.message);
      } else {
        showToast('error', error.response?.data?.error || 'Failed to create donation');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Create New Donation</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate('/donations')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Donation Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of the food items you're donating.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">
                  Food Categories
                </label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id={`category-${category.id}`}
                          name={`category-${category.id}`}
                          type="checkbox"
                          value={category.id}
                          checked={formData.categories?.includes(category.id) || false}
                          onChange={handleCategoryChange}
                          className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`category-${category.id}`} className="font-medium text-gray-700">
                          {category.name}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label htmlFor="quantity" className="block text-xs text-gray-500 mb-1">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      min="0.1"
                      step="0.1"
                      required
                      className="focus:ring-orange-500 focus:border-orange-500 block w-full rounded-md sm:text-sm border-gray-300"
                      value={formData.quantity}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setFormData(prev => ({
                          ...prev,
                          quantity: isNaN(value) ? 1 : value
                        }));
                      }}
                    />
                  </div>
                  <div className="col-span-1">
                    <label htmlFor="unit" className="block text-xs text-gray-500 mb-1">
                      Unit
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      className="focus:ring-orange-500 focus:border-orange-500 block w-full rounded-md border-gray-300 bg-white text-gray-700 sm:text-sm"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                      <option value="items">items</option>
                      <option value="servings">servings</option>
                      <option value="boxes">boxes</option>
                      <option value="packages">packages</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="expiry_date"
                    id="expiry_date"
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.expiry_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="foodbank_id" className="block text-sm font-medium text-gray-700">
                  Select Food Bank
                </label>
                <div className="mt-1">
                  <select
                    id="foodbank_id"
                    name="foodbank_id"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.foodbank_id || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        foodbank_id: value ? parseInt(value) : undefined
                      }));
                    }}
                  >
                    <option value="">Select a Food Bank</option>
                    {foodbanks.map(foodbank => (
                      <option key={foodbank.id} value={foodbank.id}>
                        {foodbank.name} ({foodbank.email})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Select the food bank that will receive this donation.
                </p>
              </div>

              <div className="sm:col-span-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Pickup Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Provide details about where and when the food can be picked up.
                </p>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="pickup_address" className="block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pickup_address"
                    id="pickup_address"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pickup_city"
                    id="pickup_city"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pickup_state"
                    id="pickup_state"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_state}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_zip_code" className="block text-sm font-medium text-gray-700">
                  ZIP / Postal Code
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="pickup_zip_code"
                    id="pickup_zip_code"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_zip_code}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="pickup_instructions" className="block text-sm font-medium text-gray-700">
                  Pickup Instructions
                </label>
                <div className="mt-1">
                  <textarea
                    id="pickup_instructions"
                    name="pickup_instructions"
                    rows={2}
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="E.g., 'Ring doorbell', 'Ask for manager', etc."
                    value={formData.pickup_instructions}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_date" className="block text-sm font-medium text-gray-700">
                  Pickup Date
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="pickup_date"
                    id="pickup_date"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_time_start" className="block text-sm font-medium text-gray-700">
                  Pickup Time Start
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    name="pickup_time_start"
                    id="pickup_time_start"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_time_start}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="pickup_time_end" className="block text-sm font-medium text-gray-700">
                  Pickup Time End
                </label>
                <div className="mt-1">
                  <input
                    type="time"
                    name="pickup_time_end"
                    id="pickup_time_end"
                    required
                    className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={formData.pickup_time_end}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Donation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
