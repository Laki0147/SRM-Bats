import { apiClient } from '../client';
import { Category, Product, PaginatedResponse, ApiResponse } from '../types';
import { cache } from '../cache';

/**
 * Categories API Endpoints
 */
export const categoriesApi = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const cacheKey = 'categories:all';
    const cached = cache.get<Category[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');

    cache.set(cacheKey, response.data.data, 30 * 60 * 1000); // Cache for 30 minutes
    return response.data.data;
  },

  /**
   * Get category by slug
   */
  async getCategoryBySlug(slug: string): Promise<Category> {
    const cacheKey = `category:${slug}`;
    const cached = cache.get<Category>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<ApiResponse<Category>>(
      `/categories/${slug}`
    );

    cache.set(cacheKey, response.data.data, 30 * 60 * 1000);
    return response.data.data;
  },

  /**
   * Get products by category
   */
  async getCategoryProducts(
    slug: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Product>> {
    const cacheKey = `category:${slug}:products:${page}:${limit}`;
    const cached = cache.get<PaginatedResponse<Product>>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<PaginatedResponse<Product>>(
      `/categories/${slug}/products`,
      {
        params: { page, limit },
      }
    );

    cache.set(cacheKey, response.data, 5 * 60 * 1000); // Cache for 5 minutes
    return response.data;
  },
};
