import { apiClient } from '../client';
import {
  Review,
  CreateReviewRequest,
  PaginatedResponse,
  ApiResponse,
} from '../types';
import { cache } from '../cache';

/**
 * Reviews API Endpoints
 */
export const reviewsApi = {
  /**
   * Get reviews for a product
   */
  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Review>> {
    const cacheKey = `reviews:${productId}:${page}:${limit}`;
    const cached = cache.get<PaginatedResponse<Review>>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await apiClient.get<PaginatedResponse<Review>>(
      `/reviews/${productId}`,
      {
        params: { page, limit },
      }
    );

    cache.set(cacheKey, response.data, 5 * 60 * 1000); // Cache for 5 minutes
    return response.data;
  },

  /**
   * Create a review
   */
  async createReview(request: CreateReviewRequest): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      '/reviews/create',
      request
    );

    // Invalidate product reviews cache
    cache.deletePattern(`reviews:${request.productId}:*`);

    return response.data.data;
  },

  /**
   * Mark review as helpful
   */
  async markReviewHelpful(reviewId: string): Promise<Review> {
    const response = await apiClient.post<ApiResponse<Review>>(
      `/reviews/${reviewId}/helpful`
    );
    return response.data.data;
  },

  /**
   * Report review
   */
  async reportReview(reviewId: string, reason: string): Promise<void> {
    await apiClient.post(`/reviews/${reviewId}/report`, { reason });
  },
};
