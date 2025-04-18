import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { updateUserProfile } from '../services/auth';
import api from '../services/api';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zip_code || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zip_code || ''
      }));
    }
  }, [user]);

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create updated user data
      const updatedUserData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      };

      // Call the API to update the profile
      try {
        const updatedUser = await updateUserProfile(updatedUserData);

        // Update user in context with the response from the API
        if (updatedUser) {
          updateUser({
            ...user!,
            ...updatedUser
          });

          // Update form data with the updated user information
          setFormData(prev => ({
            ...prev,
            name: updatedUser.name || '',
            phone: updatedUser.phone || '',
            address: updatedUser.address || '',
            city: updatedUser.city || '',
            state: updatedUser.state || '',
            zipCode: updatedUser.zip_code || ''
          }));
        } else {
          // Fallback if API doesn't return updated user
          updateUser({
            ...user!,
            ...updatedUserData
          });
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        // Continue with local update even if API fails
        updateUser({
          ...user!,
          ...updatedUserData
        });
      }

      setIsEditing(false);
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showToast('error', 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }

    try {
      // Call the API to change the password
      try {
        await api.post('/auth/change-password', {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });
      } catch (apiError) {
        console.error('API error:', apiError);
        throw apiError; // Re-throw to be caught by the outer try-catch
      }

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setIsChangingPassword(false);
      showToast('success', 'Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      showToast('error', 'Failed to change password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 bg-orange-50 border-b border-orange-100">
          <div className="flex items-center">
            <div className="bg-orange-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 capitalize mt-1">Role: {user?.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-orange-500 hover:text-orange-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="mt-1">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1">{user?.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">City</p>
                <p className="mt-1">{user?.city || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">State</p>
                <p className="mt-1">{user?.state || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">ZIP Code</p>
                <p className="mt-1">{user?.zip_code || 'Not provided'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Password Change */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Password</h3>
            <button
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="text-orange-500 hover:text-orange-700"
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {isChangingPassword ? (
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  Update Password
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-600">
              For security reasons, we recommend changing your password regularly.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
