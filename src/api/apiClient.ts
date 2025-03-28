import axios from 'axios';
import { ApiError, ApiResponse } from '../types';
import { API_CONFIG } from '../config';

// In a production app, the API key would be stored securely
// The API key should be provided by the user and stored in secure storage
// This is a placeholder that will be replaced with the actual key from secure storage
let API_KEY = ''; // This should be set via a secure method at runtime

// Create axios instance with configuration from config.ts
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.DEFAULT_HEADERS
});

// Function to get API key
const getApiKey = (): string => {
  // In a real app this might fetch from secure storage
  return API_KEY;
};

// Function to set API key (to be called at app initialization)
export const setApiKey = (key: string): void => {
  API_KEY = key;
};

// Add request interceptor
apiClient.interceptors.request.use(
  function(config) {
    // Add authorization header if API key is available
    const apiKey = getApiKey();
    if (apiKey && config.headers) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    // Create standardized error object
    const errorResponse: ApiError = {
      code: error.response?.status || 500,
      message: getErrorMessage(error)
    };
    return Promise.reject(errorResponse);
  }
);

// Helper function to get meaningful error messages
function getErrorMessage(error: any): string {
  if (!error.response) {
    return 'Network error. Please check your internet connection.';
  }

  const status = error.response.status;
  
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized access. Please login again.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Internal server error. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred.';
  }
}

// API helper methods
export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiClient;
