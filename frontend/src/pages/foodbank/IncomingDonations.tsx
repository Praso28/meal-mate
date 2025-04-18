import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getDonations, Donation, assignVolunteer } from '../../services/donations';
import { format } from 'date-fns';
import { getVolunteers } from '../../services/foodbank';

interface Volunteer {
  id: number;
  name: string;
  email: string;
  role: string;
}

const IncomingDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<number | null>(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState<number | null>(null);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const volunteerUsers = await getVolunteers();
      setVolunteers(volunteerUsers);
    } catch (error) {
      console.error('Failed to fetch volunteers:', error);
      showToast('error', 'Failed to fetch volunteers');
    }
  };

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      // Get both assigned and in_transit donations for the foodbank
      const assignedData = await getDonations('assigned');
      const inTransitData = await getDonations('in_transit');

      // Combine the results
      const combinedData = [...assignedData, ...inTransitData];

      setDonations(combinedData);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
      showToast('error', 'Failed to fetch donations');
    } finally {
      setIsLoading(false);
    }
  };

  const openAssignVolunteerModal = (donationId: number) => {
    setSelectedDonationId(donationId);
    setSelectedVolunteer(null);
    setShowVolunteerModal(true);
  };

  const closeVolunteerModal = () => {
    setShowVolunteerModal(false);
    setSelectedDonationId(null);
    setSelectedVolunteer(null);
  };

  const handleAssignVolunteer = async () => {
    if (!selectedDonationId || !selectedVolunteer) {
      showToast('error', 'Please select a volunteer');
      return;
    }

    try {
      await assignVolunteer(selectedDonationId, selectedVolunteer);
      showToast('success', 'Volunteer assigned successfully');
      fetchDonations(); // Refresh the list
      closeVolunteerModal();
    } catch (error) {
      console.error('Failed to assign volunteer:', error);
      showToast('error', 'Failed to assign volunteer');
    }
  };

  const handleViewDetails = (donationId: number) => {
    navigate(`/donations/${donationId}`);
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Incoming Donations</h1>
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
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No incoming donations</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no donations currently available for assignment.
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
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
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
                      onClick={() => openAssignVolunteerModal(donation.id)}
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Volunteer Assignment Modal */}
      {showVolunteerModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Volunteer</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Volunteer</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                value={selectedVolunteer || ''}
                onChange={(e) => setSelectedVolunteer(Number(e.target.value))}
              >
                <option value="">Select a volunteer</option>
                {volunteers.map((volunteer) => (
                  <option key={volunteer.id} value={volunteer.id}>
                    {volunteer.name} ({volunteer.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeVolunteerModal}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignVolunteer}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingDonations;
