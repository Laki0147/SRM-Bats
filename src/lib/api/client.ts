import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError, ApiResponse } from './types';

/**
 * API Client Configuration
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Create axios instance with default config
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

const apiClient = createAxiosInstance();

/**
 * Request Interceptor - Add auth token and request tracking
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for tracking
    config.metadata = { startTime: Date.now() };

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle errors and caching
 */
apiClient.interceptors.response.use(
  (response) => {
    // Log response time
    const endTime = Date.now();
    const startTime = response.config.metadata?.startTime || endTime;
    console.log(`API Request to ${response.config.url} took ${endTime - startTime}ms`);

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: number };

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      clearAuthToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic for network errors and 5xx errors
    if (
      (!error.response || error.response.status >= 500) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;

      if (originalRequest._retry < MAX_RETRIES) {
        await delay(RETRY_DELAY * originalRequest._retry);
        return apiClient(originalRequest);
      }
    }

    // Format error response
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

/**
 * Helper Functions
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Request Cancellation Support
 */
export class CancelableRequest<T> {
  private controller: AbortController;
  public promise: Promise<T>;

  constructor(requestFn: (signal: AbortSignal) => Promise<T>) {
    this.controller = new AbortController();
    this.promise = requestFn(this.controller.signal);
  }

  cancel(): void {
    this.controller.abort();
  }
}

export { apiClient };
export type { AxiosInstance };
