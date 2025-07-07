import axios from 'axios';

import { authStore } from '@/store/authStore';

// Create Axios instance with base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_KEY,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// // Add request interceptor (optional - for auth tokens)
apiClient.interceptors.request.use(
  (config: any) => {
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add response interceptor (optional - for error handling)
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful responses
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return Promise.reject(response);
  },
  (error) => {
    // Handle response errors
    if (!error.response) {
      // Network error
      return Promise.reject({
        message: 'Network Error - Please check your internet connection',
        isNetworkError: true
      });
    }

    const { status, data } = error.response;
    let errorMessage = 'Something went wrong';

    switch (status) {
      case 400:
        errorMessage = data.errorMessage || 'Invalid request';
        break;
      case 401:
        errorMessage = data.errorMessage || 'Session expired - Please login again';
        authStore.getState().logoutEndPoint();
        break;
      case 403:
        errorMessage = data.errorMessage || 'Unauthorized access';
        break;
      case 404:
        errorMessage = data.errorMessage || 'Resource not found. Please use correct credentials.';
        break;
      case 408:
        errorMessage = data.errorMessage || 'Request timeout';
        break;
      case 409:
        errorMessage = data.errorMessage || 'Conflict occurred';
        break;
      case 429:
        errorMessage = data.errorMessage || 'Too many requests - Please try again later';
        break;
      case 500:
        errorMessage = data.errorMessage || 'Server error - Our team is working on it';
        break;
      case 503:
        errorMessage = data.errorMessage || 'Service unavailable - Maintenance in progress';
        break;
      default:
        errorMessage = data.errorMessage || `Unexpected error (${status})`;
    }

    // Log errors to monitoring service
    if (status >= 500) {
      console.error('Server Error:', error);
    }

    return Promise.reject({
      message: errorMessage,
      status,
      code: data?.code || 'UNKNOWN_ERROR',
      retryable: status >= 500 || status === 429,
      ...(data.details && { details: data.details })
    });
  }
);


export default apiClient;