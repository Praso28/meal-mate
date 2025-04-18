import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../services/api';
import { getFoodbankDonationTrends } from '../../services/foodbank';

interface InventoryStats {
  total_items: number;
  low_stock_count: number;
  expiring_soon_count: number;
}

interface DonationTrend {
  month: string;
  count: number;
}

interface ExpiringItem {
  id: number;
  name: string;
  expiry_date: string;
  quantity: number;
  unit: string;
}

interface LowStockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  minimum_stock_level: number;
}

const Reports: React.FC = () => {
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [donationTrends, setDonationTrends] = useState<DonationTrend[]>([]);
  const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotifications();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch inventory stats
        const inventoryStatsResponse = await api.get('/inventory/stats');
        setInventoryStats(inventoryStatsResponse.data);

        // Fetch donation trends
        const donationTrendsResponse = await getFoodbankDonationTrends();
        setDonationTrends(donationTrendsResponse);

        // Fetch expiring items
        const expiringItemsResponse = await api.get('/inventory/expiring');
        setExpiringItems(expiringItemsResponse.data);

        // Fetch low stock items
        const lowStockItemsResponse = await api.get('/inventory/low-stock');
        setLowStockItems(lowStockItemsResponse.data);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
        showToast('error', 'Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Summary</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Overview of your current inventory status.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 sm:p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : inventoryStats ? (
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Items</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{inventoryStats.total_items}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Low Stock Items</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{inventoryStats.low_stock_count}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Expiring Soon</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{inventoryStats.expiring_soon_count}</dd>
                </div>
              </dl>
            ) : (
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No inventory data available yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Donation Trends</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Monthly donation statistics.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 sm:p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : donationTrends.length > 0 ? (
              <div className="px-4 py-5 sm:p-6">
                <div className="h-64 flex items-end space-x-2 justify-around p-4">
                  {donationTrends.map((trend) => {
                    // Use a linear scale with a base height and multiplier
                    const height = trend.count > 0 ? 10 + (trend.count * 8) : 0;
                    return (
                      <div key={trend.month} className="flex flex-col items-center mx-2">
                        <div
                          className="bg-orange-500 w-16 rounded-t-sm"
                          style={{ height: `${height}px` }}
                        ></div>
                        <div className="text-xs mt-2">{trend.month}</div>
                        <div className="text-xs font-semibold">{trend.count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
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
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No donation data available yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Expiry Alerts</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Items approaching expiration date.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 sm:p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : expiringItems.length > 0 ? (
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {expiringItems.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="text-sm text-red-600 font-medium">
                          Expires: {new Date(item.expiry_date).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No items approaching expiration.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Low Stock Items</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Items below minimum stock level.
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoading ? (
              <div className="px-4 py-5 sm:p-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                <span className="ml-2">Loading statistics...</span>
              </div>
            ) : lowStockItems.length > 0 ? (
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {lowStockItems.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.quantity} {item.unit}</p>
                        </div>
                        <div className="text-sm text-yellow-600 font-medium">
                          Min: {item.minimum_stock_level}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
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
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    No items below minimum stock level.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
