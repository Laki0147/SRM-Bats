/**
 * Recently Viewed Store
 * Tracks products the user has recently viewed
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface RecentlyViewedProduct {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  viewedAt: number;
}

export interface RecentlyViewedState {
  // State
  products: RecentlyViewedProduct[];
  maxItems: number;

  // Actions
  addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
  removeProduct: (productId: string) => void;
  clearHistory: () => void;
  getRecentByCategory: (category: string) => RecentlyViewedProduct[];
}

const MAX_RECENT_ITEMS = 20;

export const useRecentlyViewedStore = create<RecentlyViewedState>()()
  devtools(
    persist(
      immer((set, get) => ({
        products: [],
        maxItems: MAX_RECENT_ITEMS,

        addProduct: (product) =>
          set((state) => {
            // Remove if already exists
            state.products = state.products.filter(
              (p) => p.productId !== product.productId
            );

            // Add to beginning
            state.products.unshift({
              ...product,
              viewedAt: Date.now(),
            });

            // Keep only max items
            if (state.products.length > state.maxItems) {
              state.products = state.products.slice(0, state.maxItems);
            }
          }),

        removeProduct: (productId) =>
          set((state) => {
            state.products = state.products.filter((p) => p.productId !== productId);
          }),

        clearHistory: () =>
          set((state) => {
            state.products = [];
          }),

        getRecentByCategory: (category) => {
          return get().products.filter((p) => p.category === category);
        },
      })),
      {
        name: 'recently-viewed-storage',
      }
    ),
    { name: 'RecentlyViewedStore' }
  );
