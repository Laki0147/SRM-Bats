import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { cartApi } from './api';
import { tokenStorage } from './api';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image: { url: string; alt: string | null } | null;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: CartProduct;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  isLoading: boolean;
  isOpen: boolean;

  // Local-only cart (for guests)
  localItems: Array<{ productId: string; quantity: number; product: CartProduct }>;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, product?: CartProduct) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
}

const EMPTY_SUMMARY: CartSummary = { subtotal: 0, shipping: 0, tax: 0, total: 0, itemCount: 0 };

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [] as CartItem[],
      summary: EMPTY_SUMMARY,
      isLoading: false,
      isOpen: false,
      localItems: [] as Array<{ productId: string; quantity: number; product: CartProduct }>,

      fetchCart: async () => {
        if (!tokenStorage.getAccess()) return;
        set({ isLoading: true });
        try {
          const cart = await cartApi.getCart();
          set({ items: cart.items, summary: cart.summary, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      addItem: async (productId, quantity, product) => {
        if (!tokenStorage.getAccess()) {
          // Guest: add to local cart
          const current = get().localItems;
          const existing = current.find((i) => i.productId === productId);
          if (existing) {
            set({
              localItems: current.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            });
          } else if (product) {
            set({ localItems: [...current, { productId, quantity, product }] });
          }
          return;
        }

        set({ isLoading: true });
        try {
          const cart = await cartApi.addItem(productId, quantity);
          set({ items: cart.items, summary: cart.summary, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      updateItem: async (itemId, quantity) => {
        set({ isLoading: true });
        try {
          const cart = await cartApi.updateItem(itemId, quantity);
          set({ items: cart.items, summary: cart.summary, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      removeItem: async (itemId) => {
        set({ isLoading: true });
        try {
          const cart = await cartApi.removeItem(itemId);
          set({ items: cart.items, summary: cart.summary, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await cartApi.clearCart();
          set({ items: [], summary: EMPTY_SUMMARY, isLoading: false });
        } catch {
          set({ isLoading: false });
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        const { summary, localItems } = get();
        return summary.itemCount || localItems.reduce((s, i) => s + i.quantity, 0);
      },
    }),
    {
      name: 'srm-cart',
      partialize: (state: CartState) => ({ localItems: state.localItems }),
    },
  ),
);
