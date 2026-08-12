import { apiClient } from '../client';
import {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApiResponse,
} from '../types';
import { cache } from '../cache';

/**
 * Cart API Endpoints
 */
export const cartApi = {
  /**
   * Get current cart
   */
  async getCart(): Promise<Cart> {
    const response = await apiClient.get<ApiResponse<Cart>>('/cart');
    return response.data.data;
  },

  /**
   * Add item to cart
   */
  async addToCart(request: AddToCartRequest): Promise<Cart> {
    const response = await apiClient.post<ApiResponse<Cart>>(
      '/cart/add',
      request
    );

    // Invalidate cart cache
    cache.delete('cart');

    return response.data.data;
  },

  /**
   * Update cart item quantity
   */
  async updateCartItem(request: UpdateCartItemRequest): Promise<Cart> {
    const response = await apiClient.put<ApiResponse<Cart>>(
      '/cart/update',
      request
    );

    cache.delete('cart');

    return response.data.data;
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<Cart> {
    const response = await apiClient.delete<ApiResponse<Cart>>(
      `/cart/remove/${itemId}`
    );

    cache.delete('cart');

    return response.data.data;
  },

  /**
   * Clear cart
   */
  async clearCart(): Promise<void> {
    await apiClient.delete('/cart/clear');
    cache.delete('cart');
  },
};
