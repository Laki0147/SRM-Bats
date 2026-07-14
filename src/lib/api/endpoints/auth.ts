import { apiClient } from '../client';
import {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
} from '../types';
import { cache } from '../cache';

/**
 * Auth API Endpoints
 */
export const authApi = {
  /**
   * Login user
   */
  async login(request: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      request
    );

    const { token, user } = response.data.data;

    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    return response.data.data;
  },

  /**
   * Register new user
   */
  async register(request: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      request
    );

    const { token } = response.data.data;

    // Store token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    return response.data.data;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear token and cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      cache.clear();
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      '/auth/refresh'
    );

    const { token } = response.data.data;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }

    return token;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset/request', { email });
  },

  /**
   * Reset password
   */
  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', {
      token,
      password,
    });
  },
};
