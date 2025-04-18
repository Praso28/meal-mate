import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getDonationById, Donation } from '../../services/donations';
import { format } from 'date-fns';

const DonationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donation, setDonation] = useState<Donation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getDonationById(parseInt(id));
        setDonation(data);
      } catch (error) {
        console.error('Failed to fetch donation:', error);
        showToast('error', 'Failed to load donation details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonation();
  }, [id, showToast]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Donation Details</h1>
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
            <span className="ml-2">Loading donation details...</span>
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
                donation.status === 'in_transit' ? 'bg-purple-100 text-purple-800' : 
                donation.status === 'completed' ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {donation.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donation.description}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Donor</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donation.donor_name || 'Unknown'}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Quantity</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donation.quantity} {donation.unit}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {donation.expiry_date ? format(new Date(donation.expiry_date), 'MMMM d, yyyy') : 'Not specified'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pickup Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {donation.pickup_address}<br />
                  {donation.pickup_city}, {donation.pickup_state} {donation.pickup_zip_code}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pickup Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {donation.pickup_date ? format(new Date(donation.pickup_date), 'MMMM d, yyyy') : 'Not specified'}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pickup Time</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {donation.pickup_time_start} - {donation.pickup_time_end}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Pickup Instructions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {donation.pickup_instructions || 'No special instructions'}
                </dd>
              </div>
              {donation.volunteer_id && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Assigned Volunteer</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {donation.volunteer_name || 'Unknown'}
                  </dd>
                </div>
              )}
              {donation.foodbank_id && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Destination Food Bank</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {donation.foodbank_name || 'Unknown'}
                  </dd>
                </div>
              )}
            </dl>
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

export default DonationDetail;
