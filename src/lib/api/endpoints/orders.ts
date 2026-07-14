import { apiClient } from '../client';
import {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  ApiResponse,
} from '../types';

/**
 * Orders API Endpoints
 */
export const ordersApi = {
  /**
   * Create new order
   */
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      '/orders/create',
      request
    );
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/orders/${id}`
    );
    return response.data.data;
  },

  /**
   * Get order history
   */
  async getOrderHistory(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Order>> {
    const response = await apiClient.get<PaginatedResponse<Order>>(
      '/orders/history',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<Order> {
    const response = await apiClient.post<ApiResponse<Order>>(
      `/orders/${id}/cancel`
    );
    return response.data.data;
  },

  /**
   * Track order
   */
  async trackOrder(orderNumber: string): Promise<Order> {
    const response = await apiClient.get<ApiResponse<Order>>(
      `/orders/track/${orderNumber}`
    );
    return response.data.data;
  },
};
