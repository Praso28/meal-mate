import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getVolunteerAssignments, updateDonationStatus, Donation } from '../../services/donations';
import { format } from 'date-fns';

const AssignmentsList: React.FC = () => {
  const [assignments, setAssignments] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await getVolunteerAssignments();
      // Check if data is an array
      if (Array.isArray(data)) {
        setAssignments(data);
      } else if (data && typeof data === 'object') {
        // If data is an object with assignments property
        if (Array.isArray(data.assignments)) {
          setAssignments(data.assignments);
        } else if (data.data && Array.isArray(data.data)) {
          // If data has a data property that is an array
          setAssignments(data.data);
        } else {
          // If we can't find an array, set empty array
          console.error('Unexpected response format:', data);
          setAssignments([]);
        }
      } else {
        // If data is neither an array nor an object, set empty array
        console.error('Unexpected response format:', data);
        setAssignments([]);
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      showToast('error', 'Failed to fetch assignments');
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (donationId: number) => {
    navigate(`/donations/${donationId}`);
  };

  const handleMarkPickedUp = async (donationId: number) => {
    try {
      setIsLoading(true);
      await updateDonationStatus(donationId, 'in_transit');
      showToast('success', 'Donation marked as picked up');
      await fetchAssignments();
    } catch (error: any) {
      console.error('Failed to update status:', error);

      // Provide more specific error messages
      if (error.response?.status === 404) {
        showToast('error', 'Donation not found');
      } else if (error.response?.status === 403) {
        showToast('error', error.response.data?.error || 'You do not have permission to update this donation');
      } else if (error.response?.status === 400) {
        showToast('error', error.response.data?.error || 'Invalid status update');
      } else {
        showToast('error', 'Failed to update status. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkDelivered = async (donationId: number) => {
    try {
      setIsLoading(true);
      await updateDonationStatus(donationId, 'completed');
      showToast('success', 'Donation marked as delivered');
      await fetchAssignments();
    } catch (error: any) {
      console.error('Failed to update status:', error);

      // Provide more specific error messages
      if (error.response?.status === 404) {
        showToast('error', 'Donation not found');
      } else if (error.response?.status === 403) {
        showToast('error', error.response.data?.error || 'You do not have permission to update this donation');
      } else if (error.response?.status === 400) {
        showToast('error', error.response.data?.error || 'Invalid status update');
      } else {
        showToast('error', 'Failed to update status. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Assignments</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {isLoading ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading assignments...</p>
          </div>
        ) : assignments.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any active assignments at the moment.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/available-donations')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  View Available Donations
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <li key={assignment.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-orange-600 truncate">{assignment.title}</p>
                      <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${assignment.status === 'assigned' ? 'bg-blue-100 text-blue-800' : assignment.status === 'in_transit' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {assignment.status.replace('_', ' ')}
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
                        {assignment.pickup_date ? format(new Date(assignment.pickup_date), 'MMM d, yyyy') : 'No date'}
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
                        {assignment.donor_name || 'Unknown Donor'}
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
                        {assignment.pickup_address || 'No address'}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleViewDetails(assignment.id)}
                      className="mr-2 font-medium text-orange-600 hover:text-orange-500"
                    >
                      View
                    </button>
                    {assignment.status === 'assigned' && (
                      <button
                        onClick={() => handleMarkPickedUp(assignment.id)}
                        className="mr-2 font-medium text-blue-600 hover:text-blue-500"
                      >
                        Mark Picked Up
                      </button>
                    )}
                    {assignment.status === 'in_transit' && (
                      <button
                        onClick={() => handleMarkDelivered(assignment.id)}
                        className="font-medium text-green-600 hover:text-green-500"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {assignment.status !== 'assigned' && assignment.status !== 'in_transit' && (
                      <span className="text-gray-500 italic text-sm">
                        {assignment.status === 'completed' ? 'Completed' : 'Status: ' + assignment.status}
                      </span>
                    )}
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

export default AssignmentsList;
