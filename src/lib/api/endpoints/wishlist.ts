import { apiClient } from '../client';
import { Wishlist, ApiResponse } from '../types';
import { cache } from '../cache';

/**
 * Wishlist API Endpoints
 */
export const wishlistApi = {
  /**
   * Get user's wishlist
   */
  async getWishlist(): Promise<Wishlist> {
    const response = await apiClient.get<ApiResponse<Wishlist>>('/wishlist');
    return response.data.data;
  },

  /**
   * Add product to wishlist
   */
  async addToWishlist(productId: string): Promise<Wishlist> {
    const response = await apiClient.post<ApiResponse<Wishlist>>(
      '/wishlist/add',
      { productId }
    );

    cache.delete('wishlist');

    return response.data.data;
  },

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(productId: string): Promise<Wishlist> {
    const response = await apiClient.delete<ApiResponse<Wishlist>>(
      `/wishlist/remove/${productId}`
    );

    cache.delete('wishlist');

    return response.data.data;
  },

  /**
   * Check if product is in wishlist
   */
  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      return wishlist.items.some(item => item.product.id === productId);
    } catch (error) {
      return false;
    }
  },
};
