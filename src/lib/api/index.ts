/**
 * API Client - Main Export
 */
export { apiClient, CancelableRequest } from './client';
export { cache } from './cache';

// Export all endpoint APIs
export { productsApi } from './endpoints/products';
export { categoriesApi } from './endpoints/categories';
export { cartApi } from './endpoints/cart';
export { wishlistApi } from './endpoints/wishlist';
export { ordersApi } from './endpoints/orders';
export { reviewsApi } from './endpoints/reviews';
export { searchApi } from './endpoints/search';
export { authApi } from './endpoints/auth';

// Export types
export type * from './types';

// Export utilities
export {
  buildQueryString,
  formatApiError,
  isApiError,
  formatPrice,
  calculateDiscount,
  debounce,
  throttle,
} from './utils';

/**
 * Unified API object for convenience
 */
export const api = {
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  wishlist: wishlistApi,
  orders: ordersApi,
  reviews: reviewsApi,
  search: searchApi,
  auth: authApi,
} as const;
