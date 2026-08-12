/**
 * React Query Configuration
 * Configures QueryClient with default options and error handling
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { useUIStore } from '@/store';

// Default query options
const queryConfig: DefaultOptions = {
  queries: {
    // Stale time: 5 minutes
    staleTime: 5 * 60 * 1000,
    // Cache time: 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    // Refetch on window focus for important data
    refetchOnWindowFocus: false,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
    // Global error handler for mutations
    onError: (error: any) => {
      const addToast = useUIStore.getState().addToast;
      addToast({
        type: 'error',
        message: error?.message || 'An error occurred',
        duration: 5000,
      });
    },
  },
};

// Create query client
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query key factory for consistent keys
export const queryKeys = {
  // Products
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, any>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    detail: (slug: string) => [...queryKeys.categories.all, 'detail', slug] as const,
  },

  // User
  user: {
    profile: ['user', 'profile'] as const,
    orders: () => ['user', 'orders'] as const,
    order: (id: string) => ['user', 'orders', id] as const,
    addresses: ['user', 'addresses'] as const,
    wishlist: ['user', 'wishlist'] as const,
  },

  // Reviews
  reviews: {
    all: ['reviews'] as const,
    product: (productId: string) => [...queryKeys.reviews.all, productId] as const,
  },

  // Cart
  cart: {
    current: ['cart'] as const,
  },
} as const;

// Type-safe query key helper
export type QueryKeys = typeof queryKeys;
