import { apiClient, CancelableRequest } from '../client';
import {
  Product,
  ProductFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';
import { buildQueryString } from '../utils';
import { cache } from '../cache';

/**
 * Products API Endpoints
 */
export const productsApi = {
  /**
   * Get paginated list of products with filters
   */
  async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cached = cache.get<PaginatedResponse<Product>>(cacheKey);

    if (cached) {
      return cached;
    }

    const queryString = buildQueryString(filters);
    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/products${queryString}`
    );

    cache.set(cacheKey, response.data, 5 * 60 * 1000); // Cache for 5 minutes
    return response.data;
  },

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<Product> {
    const cacheKey = `product:${id}`;
    const cached = cache.get<Product>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/${id}`
    );

    cache.set(cacheKey, response.data.data, 10 * 60 * 1000); // Cache for 10 minutes
    return response.data.data;
  },

  /**
   * Get product by slug
   */
  async getProductBySlug(slug: string): Promise<Product> {
    const cacheKey = `product:slug:${slug}`;
    const cached = cache.get<Product>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Product>>(
      `/products/slug/${slug}`
    );

    cache.set(cacheKey, response.data.data, 10 * 60 * 1000);
    return response.data.data;
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(): Promise<Product[]> {
    const cacheKey = 'products:featured';
    const cached = cache.get<Product[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      '/products/featured'
    );

    cache.set(cacheKey, response.data.data, 15 * 60 * 1000); // Cache for 15 minutes
    return response.data.data;
  },

  /**
   * Get related products
   */
  async getRelatedProducts(id: string): Promise<Product[]> {
    const cacheKey = `products:related:${id}`;
    const cached = cache.get<Product[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/products/${id}/related`
    );

    cache.set(cacheKey, response.data.data, 10 * 60 * 1000);
    return response.data.data;
  },

  /**
   * Search products (cancelable)
   */
  searchProducts(
    query: string,
    filters?: ProductFilters
  ): CancelableRequest<PaginatedResponse<Product>> {
    return new CancelableRequest(async (signal) => {
      const queryString = buildQueryString({ ...filters, search: query });
      const response = await apiClient.get<PaginatedResponse<Product>>(
        `/products/search${queryString}`,
        { signal }
      );
      return response.data;
    });
  },
};
