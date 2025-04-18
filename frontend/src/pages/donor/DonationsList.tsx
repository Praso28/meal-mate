import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { getDonations, deleteDonation, Donation } from '../../services/donations';

const DonationsList: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showToast } = useNotifications();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const data = await getDonations();
      setDonations(data);
    } catch (error) {
      showToast('error', 'Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this donation?')) {
      try {
        await deleteDonation(id);
        setDonations(donations.filter(donation => donation.id !== id));
        showToast('success', 'Donation deleted successfully');
      } catch (error) {
        showToast('error', 'Failed to delete donation');
      }
    }
  };

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    return donation.status === filter;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Donations</h1>
        <Link
          to="/donations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Donation
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
        <div className="px-4 py-4 border-b border-gray-200 sm:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Donation History</h3>
            <div className="flex mt-2 sm:mt-0">
              <select
                id="filter"
                name="filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Donations</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_transit">In Transit</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <li className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading donations...</span>
              </div>
            </li>
          ) : filteredDonations.length === 0 ? (
            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
              No donations found. Click "New Donation" to create one.
            </li>
          ) : (
            filteredDonations.map((donation) => (
              <li key={donation.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-orange-600 truncate">{donation.title}</p>
                      <span
                        className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          donation.status
                        )}`}
                      >
                        {donation.status.replace('_', ' ')}
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
                        {new Date(donation.created_at).toLocaleDateString()}
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
                        {donation.pickup_address || 'No address provided'}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{donation.description}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <Link
                      to={`/donations/${donation.id}`}
                      className="mr-2 font-medium text-orange-600 hover:text-orange-500"
                    >
                      View
                    </Link>
                    {donation.status === 'pending' && (
                      <>
                        <Link
                          to={`/donations/${donation.id}/edit`}
                          className="mr-2 font-medium text-blue-600 hover:text-blue-500"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(donation.id)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default DonationsList;
