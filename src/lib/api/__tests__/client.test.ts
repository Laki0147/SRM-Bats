import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiClient } from '../client';
import { ApiError } from '../types';

describe('API Client', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(apiClient);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  describe('Request Interceptor', () => {
    it('should add auth token to request headers', async () => {
      const token = 'test-token';
      localStorage.setItem('auth_token', token);

      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBe(`Bearer ${token}`);
        return [200, { data: 'success' }];
      });

      await apiClient.get('/test');
    });

    it('should not add auth header when token is not present', async () => {
      mock.onGet('/test').reply((config) => {
        expect(config.headers?.Authorization).toBeUndefined();
        return [200, {  'success' }];
      });

      await apiClient.get('/test');
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful responses', async () => {
      const responseData = {  'test' };
      mock.onGet('/test').reply(200, responseData);

      const response = await apiClient.get('/test');
      expect(response.data).toEqual(responseData);
    });

    it('should handle 401 errors and redirect to login', async () => {
      const token = 'test-token';
      localStorage.setItem('auth_token', token);

      mock.onGet('/test').reply(401, {
        message: 'Unauthorized',
        code: 'UNAUTHORIZED',
      });

      // Mock window.location.href
      delete (window as any).location;
      window.location = { href: '' } as any;

      try {
        await apiClient.get('/test');
      } catch (error) {
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(window.location.href).toBe('/login');
      }
    });

    it('should retry on network errors', async () => {
      let attempts = 0;

      mock.onGet('/test').reply(() => {
        attempts++;
        if (attempts < 3) {
          return [500, { message: 'Server error' }];
        }
        return [200, {  'success' }];
      });

      const response = await apiClient.get('/test');
      expect(response.data).toEqual({ data: 'success' });
      expect(attempts).toBe(3);
    });

    it('should format error responses', async () => {
      const errorResponse = {
        message: 'Validation error',
        code: 'VALIDATION_ERROR',
      };

      mock.onGet('/test').reply(400, errorResponse);

      try {
        await apiClient.get('/test');
      } catch (error) {
        const apiError = error as ApiError;
        expect(apiError.message).toBe('Validation error');
        expect(apiError.code).toBe('VALIDATION_ERROR');
        expect(apiError.status).toBe(400);
      }
    });
  });

  describe('Request Cancellation', () => {
    it('should cancel pending requests', async () => {
      mock.onGet('/test').reply(() => {
        return new Promise((resolve) => {
          setTimeout(() => resolve([200, {  'success' }]), 1000);
        });
      });

      const controller = new AbortController();
      const request = apiClient.get('/test', { signal: controller.signal });

      controller.abort();

      try {
        await request;
      } catch (error: any) {
        expect(error.code).toBe('ERR_CANCELED');
      }
    });
  });
});
