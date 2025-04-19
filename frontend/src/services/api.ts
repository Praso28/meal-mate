import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  timeoutErrorMessage: 'Request timed out. Please try again later.',
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle unauthorized errors (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Handle bad request errors (400)
    if (error.response?.status === 400) {
      console.error('Bad Request Error:', error.response.data);
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.error('Network error:', error.message);
      // You can add custom handling for network errors here
      // For example, show a notification or retry the request
    }

    return Promise.reject(error);
  }
);

export default api;
