import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { getDonationStats, getUserStats } from '../../services/admin';

interface DonationStats {
  total_donations: number;
  completed_donations: number;
  pending_donations: number;
  in_progress_donations: number;
}

interface UserStats {
  total_users: number;
  donor_count: number;
  volunteer_count: number;
  foodbank_count: number;
  admin_count: number;
}

const Reports: React.FC = () => {
  const [donationStats, setDonationStats] = useState<DonationStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [donationData, userData] = await Promise.all([
          getDonationStats(),
          getUserStats()
        ]);
        setDonationStats(donationData);
        setUserStats(userData);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        showToast('error', 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleExportCSV = () => {
    showToast('info', 'Export functionality is not yet implemented');
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Donation Statistics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of donation activity in the system.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : donationStats ? (
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Donations</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donationStats.total_donations}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Pending Donations</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donationStats.pending_donations}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Completed Donations</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donationStats.completed_donations}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">In Progress Donations</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{donationStats.in_progress_donations}</dd>
                </div>
              </dl>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                No donation statistics available.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">User Statistics</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of user activity in the system.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : userStats ? (
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userStats.total_users}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Donors</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userStats.donor_count}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Volunteers</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userStats.volunteer_count}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Food Banks</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userStats.foodbank_count}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Admins</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{userStats.admin_count}</dd>
                </div>
              </dl>
            ) : (
              <div className="px-4 py-5 text-center text-gray-500">
                No user statistics available.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Top Donors</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Users with the most donations.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 text-center text-gray-500">
              This feature is not yet implemented.
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Most Active Volunteers</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Volunteers with the most completed assignments.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <div className="px-4 py-5 text-center text-gray-500">
              This feature is not yet implemented.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
