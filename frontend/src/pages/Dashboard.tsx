import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  getDashboardStats,
  getAdminDashboardStats,
  getDonorDashboardStats,
  getVolunteerDashboardStats,
  getFoodbankDashboardStats,
  getFoodbankDonationTrends,
  DashboardStats,
  DonationTrend
} from '../services/dashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [stats, setStats] = useState<DashboardStats>({
    totalDonations: 0,
    pendingDonations: 0,
    completedDonations: 0,
    assignedVolunteers: 0,
    totalUsers: 0,
    activeVolunteers: 0,
    foodBanks: 0,
    inventoryItems: 0,
    incomingDonations: 0,
    lowStockItems: 0,
    storageCapacity: 0,
    userAssignments: 0,
    completedPickups: 0,
    availableDonations: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      setIsLoading(true);
      try {
        let data;

        // Fetch stats based on user role
        switch (user?.role) {
          case 'admin':
            data = await getAdminDashboardStats();
            break;
          case 'donor':
            data = await getDonorDashboardStats();
            break;
          case 'volunteer':
            data = await getVolunteerDashboardStats();
            break;
          case 'foodbank':
            data = await getFoodbankDashboardStats();

            // Also fetch donation trends for foodbank
            try {
              const trendsData = await getFoodbankDonationTrends();
              setDonationTrends(trendsData);
            } catch (trendsError) {
              console.error('Failed to fetch donation trends:', trendsError);
              setDonationTrends([]);
            }
            break;
          default:
            data = await getDashboardStats();
        }

        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        showToast('error', 'Failed to load dashboard statistics');

        // Set fallback data if API fails
        setStats({
          totalDonations: 0,
          pendingDonations: 0,
          completedDonations: 0,
          assignedVolunteers: 0,
          totalUsers: 0,
          activeVolunteers: 0,
          foodBanks: 0,
          inventoryItems: 0,
          incomingDonations: 0,
          lowStockItems: 0,
          storageCapacity: 0,
          userAssignments: 0,
          completedPickups: 0,
          availableDonations: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user?.role, showToast]);

  // Render different dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return renderAdminDashboard();
      case 'donor':
        return renderDonorDashboard();
      case 'volunteer':
        return renderVolunteerDashboard();
      case 'foodbank':
        return renderFoodbankDashboard();
      default:
        return <div>Unknown user role</div>;
    }
  };

  const renderAdminDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard title="Total Users" value={stats.totalUsers?.toString() || '0'} icon="users" color="bg-blue-500" />
            <DashboardCard title="Total Donations" value={stats.totalDonations.toString()} icon="gift" color="bg-green-500" />
            <DashboardCard title="Active Volunteers" value={stats.activeVolunteers?.toString() || '0'} icon="user-check" color="bg-purple-500" />
            <DashboardCard title="Food Banks" value={stats.foodBanks?.toString() || '0'} icon="home" color="bg-yellow-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <p className="text-gray-500">Activity feed will be displayed here</p>
          </div>
        </>
      )}
    </div>
  );

  const renderDonorDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Donor Dashboard</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <DashboardCard title="Your Donations" value={stats.totalDonations.toString()} icon="gift" color="bg-orange-500" />
            <DashboardCard title="Pending Donations" value={stats.pendingDonations.toString()} icon="clock" color="bg-yellow-500" />
            <DashboardCard title="Completed Donations" value={stats.completedDonations.toString()} icon="check-circle" color="bg-green-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Donations</h3>
              <button
                onClick={() => window.location.href = '/donations'}
                className="text-orange-500 hover:text-orange-700"
              >
                View All
              </button>
            </div>
            <p className="text-gray-500">Your recent donations will be displayed here</p>
          </div>
        </>
      )}
    </div>
  );

  const renderVolunteerDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Volunteer Dashboard</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <DashboardCard title="Your Assignments" value={stats.userAssignments?.toString() || '0'} icon="clipboard-list" color="bg-blue-500" />
            <DashboardCard title="Completed Pickups" value={stats.completedPickups?.toString() || '0'} icon="check-circle" color="bg-green-500" />
            <DashboardCard title="Available Donations" value={stats.availableDonations?.toString() || '0'} icon="gift" color="bg-yellow-500" />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
              <button
                onClick={() => window.location.href = '/assignments'}
                className="text-orange-500 hover:text-orange-700"
              >
                View All
              </button>
            </div>
            <p className="text-gray-500">Your upcoming assignments will be displayed here</p>
          </div>
        </>
      )}
    </div>
  );

  const renderFoodbankDashboard = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Food Bank Dashboard</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <DashboardCard title="Inventory Items" value={stats.inventoryItems?.toString() || '0'} icon="box" color="bg-blue-500" />
            <DashboardCard title="Incoming Donations" value={stats.incomingDonations?.toString() || '0'} icon="truck" color="bg-yellow-500" />
            <DashboardCard title="Low Stock Items" value={stats.lowStockItems?.toString() || '0'} icon="alert-circle" color="bg-red-500" />
            <DashboardCard title="Storage Capacity" value={`${stats.storageCapacity || 0}%`} icon="database" color="bg-green-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Inventory Status</h3>
                <button
                  onClick={() => window.location.href = '/inventory'}
                  className="text-orange-500 hover:text-orange-700"
                >
                  View Inventory
                </button>
              </div>
              <p className="text-gray-500">Inventory chart will be displayed here</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Incoming Donations</h3>
                <button
                  onClick={() => window.location.href = '/incoming-donations'}
                  className="text-orange-500 hover:text-orange-700"
                >
                  View All
                </button>
              </div>
              {stats.incomingDonations > 0 ? (
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-500">{stats.incomingDonations}</p>
                  <p className="text-sm text-gray-500">donations waiting to be processed</p>
                </div>
              ) : (
                <p className="text-gray-500">No incoming donations at this time</p>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Donation Trends</h3>
            </div>
            {donationTrends.length > 0 ? (
              <div className="h-64">
                <div className="flex justify-around items-end h-48 border-b border-l border-gray-300 relative p-4">
                  {donationTrends.map((trend, index) => {
                    // Use a logarithmic scale to make differences more visible
                    // Add 1 to avoid log(0) and multiply by a factor to increase visibility
                    const height = trend.count > 0 ? 10 + (trend.count * 8) : 0;
                    return (
                      <div key={index} className="flex flex-col items-center mx-2">
                        <div
                          className="w-16 bg-orange-500 rounded-t-sm"
                          style={{ height: `${height}px` }}
                        ></div>
                        <div className="text-xs text-gray-500 mt-2">{trend.month}</div>
                        <div className="text-sm font-medium">{trend.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No donation data available</p>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="py-6">
      {renderDashboard()}
    </div>
  );
};

// Dashboard card component
interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color }) => {
  // Function to render icon based on name
  const renderIcon = () => {
    switch (icon) {
      case 'users':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'gift':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        );
      case 'user-check':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'home':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'check-circle':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'clipboard-list':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      case 'box':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'truck':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case 'alert-circle':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          {renderIcon()}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
