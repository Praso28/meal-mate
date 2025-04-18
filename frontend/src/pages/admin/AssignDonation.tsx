import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getDonationById, Donation, updateDonation } from '../../services/donations';
import { getUsers, User } from '../../services/admin';
import { format } from 'date-fns';

const AssignDonation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [volunteers, setVolunteers] = useState<User[]>([]);
  const [foodbanks, setFoodbanks] = useState<User[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<number | null>(null);
  const [selectedFoodbank, setSelectedFoodbank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch donation details
        const donationData = await getDonationById(parseInt(id));
        setDonation(donationData);
        
        // Fetch users for assignment
        const usersData = await getUsers();
        
        // Filter volunteers and foodbanks
        const volunteersList = usersData.filter(user => user.role === 'volunteer');
        const foodbanksList = usersData.filter(user => user.role === 'foodbank');
        
        setVolunteers(volunteersList);
        setFoodbanks(foodbanksList);
        
        // Set initial selected values if already assigned
        if (donationData.volunteer_id) {
          setSelectedVolunteer(donationData.volunteer_id);
        }
        
        if (donationData.foodbank_id) {
          setSelectedFoodbank(donationData.foodbank_id);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        showToast('error', 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, showToast]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !selectedVolunteer || !selectedFoodbank) {
      showToast('error', 'Please select both a volunteer and a food bank');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Update donation with assigned volunteer and foodbank
      await updateDonation(parseInt(id), {
        volunteer_id: selectedVolunteer,
        foodbank_id: selectedFoodbank,
        status: 'assigned'
      });
      
      showToast('success', 'Donation assigned successfully');
      navigate('/admin/donations');
    } catch (error) {
      console.error('Failed to assign donation:', error);
      showToast('error', 'Failed to assign donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Assign Donation</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Back
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <span className="ml-2">Loading...</span>
          </div>
        </div>
      ) : donation ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">{donation.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Created on {format(new Date(donation.created_at), 'MMMM d, yyyy')}
                </p>
              </div>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                donation.status === 'assigned' ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {donation.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Donation Information</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {donation.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="donor" className="block text-sm font-medium text-gray-700">
                      Donor
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="donor"
                        id="donor"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={donation.donor_name || 'Unknown'}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700">
                      Pickup Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="pickup-date"
                        id="pickup-date"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={donation.pickup_date ? format(new Date(donation.pickup_date), 'MMMM d, yyyy') : 'Not specified'}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="pickup-address" className="block text-sm font-medium text-gray-700">
                      Pickup Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="pickup-address"
                        id="pickup-address"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={`${donation.pickup_address}, ${donation.pickup_city}, ${donation.pickup_state} ${donation.pickup_zip_code}`}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700">
                      Pickup Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="pickup-time"
                        id="pickup-time"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={`${donation.pickup_time_start} - ${donation.pickup_time_end}`}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Assignment</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Assign a volunteer and food bank to this donation
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="volunteer" className="block text-sm font-medium text-gray-700">
                      Volunteer
                    </label>
                    <div className="mt-1">
                      <select
                        id="volunteer"
                        name="volunteer"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={selectedVolunteer || ''}
                        onChange={(e) => setSelectedVolunteer(e.target.value ? parseInt(e.target.value) : null)}
                        required
                      >
                        <option value="">Select a volunteer</option>
                        {volunteers.map((volunteer) => (
                          <option key={volunteer.id} value={volunteer.id}>
                            {volunteer.name} ({volunteer.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="foodbank" className="block text-sm font-medium text-gray-700">
                      Food Bank
                    </label>
                    <div className="mt-1">
                      <select
                        id="foodbank"
                        name="foodbank"
                        className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={selectedFoodbank || ''}
                        onChange={(e) => setSelectedFoodbank(e.target.value ? parseInt(e.target.value) : null)}
                        required
                      >
                        <option value="">Select a food bank</option>
                        {foodbanks.map((foodbank) => (
                          <option key={foodbank.id} value={foodbank.id}>
                            {foodbank.name} ({foodbank.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Assigning...' : 'Assign Donation'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <p className="text-gray-500">Donation not found</p>
        </div>
      )}
    </div>
  );
};

export default AssignDonation;
