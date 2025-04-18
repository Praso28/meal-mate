import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AxiosError } from 'axios';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'donor',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    organizationName: '',
    organizationType: ''
  });

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { register } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  // Add effect to log error message changes
  useEffect(() => {
    if (errorMessage) {
      console.log('Error message set:', errorMessage);
    }
  }, [errorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error message when user changes input
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate first step
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
        showToast('error', 'Please fill in all required fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        showToast('error', 'Passwords do not match');
        return;
      }

      if (formData.password.length < 8) {
        showToast('error', 'Password must be at least 8 characters long');
        return;
      }
    }

    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        organization_name: formData.organizationName,
        organization_type: formData.organizationType
      });

      showToast('success', 'Registration successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);

      // Type assertion for better error handling
      const axiosError = error as AxiosError<{error?: string, message?: string}>;

      // Handle different types of errors
      let errorMsg = 'Registration failed';

      if (axiosError.code === 'ERR_NETWORK') {
        errorMsg = 'Network error. Please check your connection or try again later.';
      } else if (axiosError.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const responseData = axiosError.response.data as {error?: string, message?: string};
        errorMsg = responseData?.error || responseData?.message || 'Registration failed';
      } else if (axiosError.request) {
        // The request was made but no response was received
        errorMsg = 'No response from server. Please try again later.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMsg = axiosError.message || 'Registration failed';
      }

      // Set error message and show toast
      setErrorMessage(errorMsg);
      showToast('error', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.password}
          onChange={handleChange}
        />
        <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          I am registering as a
        </label>
        <select
          id="role"
          name="role"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="donor">Food Donor</option>
          <option value="volunteer">Volunteer</option>
          <option value="foodbank">Food Bank / NGO</option>
        </select>
      </div>

      <div>
        <button
          type="button"
          onClick={handleNextStep}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            id="state"
            name="state"
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <input
          id="zipCode"
          name="zipCode"
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
          value={formData.zipCode}
          onChange={handleChange}
        />
      </div>

      {formData.role === 'foodbank' && (
        <>
          <div>
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              id="organizationName"
              name="organizationName"
              type="text"
              required={formData.role === 'foodbank'}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={formData.organizationName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="organizationType" className="block text-sm font-medium text-gray-700">
              Organization Type
            </label>
            <input
              id="organizationType"
              name="organizationType"
              type="text"
              placeholder="e.g., Non-profit, Food Bank, Shelter"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              value={formData.organizationType}
              onChange={handleChange}
            />
          </div>
        </>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={handlePrevStep}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Back
        </button>

        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-orange-500">MealMate</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="flex justify-center">
          <ol className="flex items-center w-full">
            <li className={`flex items-center ${step >= 1 ? 'text-orange-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                1
              </span>
              <span className="ml-2 text-sm font-medium">Account</span>
            </li>
            <div className="w-12 border-t border-gray-200 mx-2"></div>
            <li className={`flex items-center ${step >= 2 ? 'text-orange-600' : 'text-gray-500'}`}>
              <span className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                2
              </span>
              <span className="ml-2 text-sm font-medium">Details</span>
            </li>
          </ol>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="rounded-md bg-red-50 p-4 mb-4 border border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{errorMessage}</h3>
                </div>
              </div>
            </div>
          ) : null}
          {step === 1 ? renderStep1() : renderStep2()}
        </form>
      </div>
    </div>
  );
};

export default Register;
