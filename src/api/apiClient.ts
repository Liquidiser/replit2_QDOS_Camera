import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from '../types';

// Base URL from API specification
const BASE_URL = 'https://api.qrservice.com/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get API key from environment
const getApiKey = (): string => {
  return process.env.API_KEY || '';
};

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const apiKey = getApiKey();
    if (apiKey && config.headers) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const errorResponse: ApiError = {
      code: error.response?.status || 500,
      message: mapErrorMessage(error)
    };
    return Promise.reject(errorResponse);
  }
);

// Map error messages based on status codes
const mapErrorMessage = (error: AxiosError): string => {
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
};

// Generic request function
const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// API helper functions
export const api = {
  get: <T>(url: string, params?: object): Promise<T> => {
    return request<T>({ method: 'GET', url, params });
  },
  post: <T>(url: string, data?: object): Promise<T> => {
    return request<T>({ method: 'POST', url, data });
  },
  put: <T>(url: string, data?: object): Promise<T> => {
    return request<T>({ method: 'PUT', url, data });
  },
  delete: <T>(url: string): Promise<T> => {
    return request<T>({ method: 'DELETE', url });
  }
};

export default apiClient;
