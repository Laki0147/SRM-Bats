import { apiClient, CancelableRequest } from '../client';
import { SearchResult, ApiResponse } from '../types';

/**
 * Search API Endpoints
 */
export const searchApi = {
  /**
   * Search products and categories (cancelable)
   */
  search(query: string): CancelableRequest<SearchResult> {
    return new CancelableRequest(async (signal) => {
      const response = await apiClient.get<ApiResponse<SearchResult>>(
        '/search',
        {
          params: { q: query },
          signal,
        }
      );
      return response.data.data;
    });
  },

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await apiClient.get<ApiResponse<string[]>>(
      '/search/suggestions',
      {
        params: { q: query },
      }
    );
    return response.data.data;
  },

  /**
   * Get popular searches
   */
  async getPopularSearches(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>(
      '/search/popular'
    );
    return response.data.data;
  },
};
