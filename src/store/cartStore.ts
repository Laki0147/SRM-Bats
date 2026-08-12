/**
 * Shopping Cart Store
 * Manages cart items, quantities, and cart operations
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  variant?: {
    size?: string;
    color?: string;
    weight?: string;
  };
  stock: number;
  maxQuantity?: number;
}

export interface CartState {
  // State
  items: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Computed
  itemCount: number;
  subtotal: number;
  totalDiscount: number;
  total: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = items.reduce(
    (sum, item) =>
      sum + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0),
    0
  );
  return {
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    totalDiscount,
    total: subtotal,
  };
};

export const useCartStore = create<CartState>()()
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        isLoading: false,
        error: null,
        itemCount: 0,
        subtotal: 0,
        totalDiscount: 0,
        total: 0,

        addItem: (newItem) =>
          set((state) => {
            const existingItemIndex = state.items.findIndex(
              (item) =>
                item.productId === newItem.productId &&
                JSON.stringify(item.variant) === JSON.stringify(newItem.variant)
            );

            if (existingItemIndex > -1) {
              // Update quantity if item exists
              const existingItem = state.items[existingItemIndex];
              const newQuantity = existingItem.quantity + (newItem.quantity || 1);
              const maxQty = existingItem.maxQuantity || existingItem.stock;

              if (newQuantity <= maxQty) {
                state.items[existingItemIndex].quantity = newQuantity;
              } else {
                state.error = `Cannot add more than ${maxQty} items`;
                return;
              }
            } else {
              // Add new item
              state.items.push({
                ...newItem,
                quantity: newItem.quantity || 1,
              });
            }

            // Recalculate totals
            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
            state.error = null;
          }),

        removeItem: (itemId) =>
          set((state) => {
            state.items = state.items.filter((item) => item.id !== itemId);
            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
          }),

        updateQuantity: (itemId, quantity) =>
          set((state) => {
            const itemIndex = state.items.findIndex((item) => item.id === itemId);
            if (itemIndex === -1) return;

            const item = state.items[itemIndex];
            const maxQty = item.maxQuantity || item.stock;

            if (quantity <= 0) {
              state.items.splice(itemIndex, 1);
            } else if (quantity <= maxQty) {
              state.items[itemIndex].quantity = quantity;
            } else {
              state.error = `Cannot add more than ${maxQty} items`;
              return;
            }

            const totals = calculateTotals(state.items);
            Object.assign(state, totals);
            state.error = null;
          }),

        clearCart: () =>
          set((state) => {
            state.items = [];
            state.itemCount = 0;
            state.subtotal = 0;
            state.totalDiscount = 0;
            state.total = 0;
            state.error = null;
          }),

        applyDiscount: async (code) => {
          set((state) => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const response = await fetch('/api/cart/discount', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });

            if (!response.ok) {
              throw new Error('Invalid discount code');
            }

            const data = await response.json();

            set((state) => {
              // Apply discount logic here
              state.total = data.newTotal;
              state.isLoading = false;
            });
          } catch (error) {
            set((state) => {
              state.error = error instanceof Error ? error.message : 'Failed to apply discount';
              state.isLoading = false;
            });
            throw error;
          }
        },

        syncWithServer: async () => {
          const { items } = get();
          try {
            await fetch('/api/cart/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ items }),
            });
          } catch (error) {
            console.error('Failed to sync cart:', error);
          }
        },
      })),
      {
        name: 'cart-storage',
        partialize: (state) => ({
          items: state.items,
        }),
      }
    ),
    { name: 'CartStore' }
  );
