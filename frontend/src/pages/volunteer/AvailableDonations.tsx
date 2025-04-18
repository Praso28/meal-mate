import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getDonations, Donation, assignVolunteer } from '../../services/donations';
import { format } from 'date-fns';

const AvailableDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const data = await getDonations('pending');
      // Check if data is an array
      if (Array.isArray(data)) {
        setDonations(data);
      } else if (data && typeof data === 'object') {
        // If data is an object with donations property
        if (Array.isArray(data.donations)) {
          setDonations(data.donations);
        } else if (data.data && Array.isArray(data.data)) {
          // If data has a data property that is an array
          setDonations(data.data);
        } else {
          // If we can't find an array, set empty array
          console.error('Unexpected response format:', data);
          setDonations([]);
        }
      } else {
        // If data is neither an array nor an object, set empty array
        console.error('Unexpected response format:', data);
        setDonations([]);
      }
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      showToast('error', 'Failed to fetch donations');
      setDonations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAssignment = async (donationId: number) => {
    try {
      await assignVolunteer(donationId);
      showToast('success', 'Assignment accepted successfully');
      navigate('/assignments');
    } catch (error) {
      console.error('Failed to accept assignment:', error);
      showToast('error', 'Failed to accept assignment');
    }
  };

  const handleViewDetails = (donationId: number) => {
    navigate(`/donations/${donationId}`);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Available Donations</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={fetchDonations}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading donations...</p>
          </div>
        ) : donations.length === 0 ? (
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-10">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No available donations</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no donations available for pickup at the moment.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please check back later or contact your coordinator.
              </p>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {donations.map((donation) => (
              <li key={donation.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-orange-600 truncate">{donation.title}</p>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {donation.status}
                      </span>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500 mr-6">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {donation.pickup_date ? format(new Date(donation.pickup_date), 'MMM d, yyyy') : 'No date'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mr-6">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {donation.donor_name || 'Unknown Donor'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {donation.pickup_city}, {donation.pickup_state}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {donation.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleViewDetails(donation.id)}
                      className="mr-2 font-medium text-orange-600 hover:text-orange-500"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleAcceptAssignment(donation.id)}
                      className="font-medium text-green-600 hover:text-green-500"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailableDonations;
