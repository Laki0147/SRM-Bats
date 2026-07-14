/**
 * Wishlist Store
 * Manages user's wishlist items and operations
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  addedAt: number;
}

export interface WishlistState {
  // State
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (itemId: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  syncWithServer: () => Promise<void>;
  moveToCart: (itemId: string) => void;
}

export const useWishlistStore = create<WishlistState>()()
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        isLoading: false,
        error: null,

        addItem: (newItem) =>
          set((state) => {
            const exists = state.items.some((item) => item.productId === newItem.productId);
            if (!exists) {
              state.items.push({
                ...newItem,
                addedAt: Date.now(),
              });
            }
          }),

        removeItem: (itemId) =>
          set((state) => {
            state.items = state.items.filter((item) => item.id !== itemId);
          }),

        toggleItem: (item) =>
          set((state) => {
            const existingIndex = state.items.findIndex(
              (i) => i.productId === item.productId
            );

            if (existingIndex > -1) {
              state.items.splice(existingIndex, 1);
            } else {
              state.items.push({
                ...item,
                addedAt: Date.now(),
              });
            }
          }),

        isInWishlist: (productId) => {
          return get().items.some((item) => item.productId === productId);
        },

        clearWishlist: () =>
          set((state) => {
            state.items = [];
          }),

        syncWithServer: async () => {
          const { items } = get();
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            await fetch('/api/wishlist/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items }),
            });

            set((state) => {
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Sync failed';
              state.isLoading = false;
            });
          }
        },

        moveToCart: (itemId) => {
          const item = get().items.find((i) => i.id === itemId);
          if (item) {
            // This would typically import and use the cart store
            // For now, we'll just remove from wishlist
            set((state) => {
              state.items = state.items.filter((i) => i.id !== itemId);
            });
          }
        },
      })),
      {
        name: 'wishlist-storage',
      }
    ),
    { name: 'WishlistStore' }
  );
