import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';

const Settings: React.FC = () => {
  const { showToast } = useNotifications();
  const [generalSettings, setGeneralSettings] = useState({
    systemName: 'MealMate',
    contactEmail: 'support@mealmate.org',
    maxDonationDays: 30
  });

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would save the settings to the API
    showToast('success', 'Settings saved successfully');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Application Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Basic application configuration settings.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSaveGeneral}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="systemName" className="block text-sm font-medium text-gray-700">
                    Application Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="systemName"
                      id="systemName"
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={generalSettings.systemName}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                    Support Email
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={generalSettings.contactEmail}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="maxDonationDays" className="block text-sm font-medium text-gray-700">
                    Maximum Donation Days in Advance
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="maxDonationDays"
                      id="maxDonationDays"
                      min="1"
                      max="90"
                      className="shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={generalSettings.maxDonationDays}
                      onChange={handleGeneralChange}
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Maximum number of days a donation can be scheduled in advance.
                  </p>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Help & Documentation */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Help & Documentation</h3>
            <p className="mt-1 text-sm text-gray-500">
              Resources to help you use the application.
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-md font-medium text-gray-900">User Manual</h4>
                  <p className="text-sm text-gray-500">Comprehensive guide to using MealMate</p>
                  <a href="#" className="text-sm text-orange-500 hover:text-orange-700 mt-1 inline-block">View Documentation</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-md font-medium text-gray-900">FAQ</h4>
                  <p className="text-sm text-gray-500">Frequently asked questions about the platform</p>
                  <a href="#" className="text-sm text-orange-500 hover:text-orange-700 mt-1 inline-block">View FAQ</a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-md font-medium text-gray-900">Contact Support</h4>
                  <p className="text-sm text-gray-500">Need help? Contact our support team</p>
                  <a href={`mailto:${generalSettings.contactEmail}`} className="text-sm text-orange-500 hover:text-orange-700 mt-1 inline-block">Email Support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
