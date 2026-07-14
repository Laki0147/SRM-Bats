/**
 * UI Store
 * Manages UI state like modals, drawers, loading states, notifications
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  component: string;
  props?: Record<string, any>;
}

export interface UIState {
  // Modals
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  // Drawers
  isCartDrawerOpen: boolean;
  isFilterDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleCartDrawer: () => void;
  toggleFilterDrawer: () => void;
  toggleMobileMenu: () => void;
  closeAllDrawers: () => void;

  // Loading states
  globalLoading: boolean;
  loadingStates: Record<string, boolean>;
  setGlobalLoading: (loading: boolean) => void;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Search
  searchQuery: string;
  isSearchOpen: boolean;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
  clearSearch: () => void;

  // Scroll
  scrollY: number;
  setScrollY: (y: number) => void;
}

let toastIdCounter = 0;
let modalIdCounter = 0;

export const useUIStore = create<UIState>()()
  devtools(
    immer((set, get) => ({
      // Modals
      modals: [],
      openModal: (modal) => {
        const id = `modal-${++modalIdCounter}`;
        set((state) => {
          state.modals.push({ ...modal, id });
        });
        return id;
      },
      closeModal: (id) =>
        set((state) => {
          state.modals = state.modals.filter((m) => m.id !== id);
        }),
      closeAllModals: () =>
        set((state) => {
          state.modals = [];
        }),

      // Drawers
      isCartDrawerOpen: false,
      isFilterDrawerOpen: false,
      isMobileMenuOpen: false,
      toggleCartDrawer: () =>
        set((state) => {
          state.isCartDrawerOpen = !state.isCartDrawerOpen;
          if (state.isCartDrawerOpen) {
            state.isFilterDrawerOpen = false;
            state.isMobileMenuOpen = false;
          }
        }),
      toggleFilterDrawer: () =>
        set((state) => {
          state.isFilterDrawerOpen = !state.isFilterDrawerOpen;
          if (state.isFilterDrawerOpen) {
            state.isCartDrawerOpen = false;
            state.isMobileMenuOpen = false;
          }
        }),
      toggleMobileMenu: () =>
        set((state) => {
          state.isMobileMenuOpen = !state.isMobileMenuOpen;
          if (state.isMobileMenuOpen) {
            state.isCartDrawerOpen = false;
            state.isFilterDrawerOpen = false;
          }
        }),
      closeAllDrawers: () =>
        set((state) => {
          state.isCartDrawerOpen = false;
          state.isFilterDrawerOpen = false;
          state.isMobileMenuOpen = false;
        }),

      // Loading states
      globalLoading: false,
      loadingStates: {},
      setGlobalLoading: (loading) =>
        set((state) => {
          state.globalLoading = loading;
        }),
      setLoading: (key, loading) =>
        set((state) => {
          state.loadingStates[key] = loading;
        }),
      isLoading: (key) => {
        return get().loadingStates[key] || false;
      },

      // Toasts
      toasts: [],
      addToast: (toast) => {
        const id = `toast-${++toastIdCounter}`;
        set((state) => {
          state.toasts.push({ ...toast, id });
        });

        // Auto-remove after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
          set((state) => {
            state.toasts = state.toasts.filter((t) => t.id !== id);
          });
        }, duration);

        return id;
      },
      removeToast: (id) =>
        set((state) => {
          state.toasts = state.toasts.filter((t) => t.id !== id);
        }),
      clearToasts: () =>
        set((state) => {
          state.toasts = [];
        }),

      // Search
      searchQuery: '',
      isSearchOpen: false,
      setSearchQuery: (query) =>
        set((state) => {
          state.searchQuery = query;
        }),
      toggleSearch: () =>
        set((state) => {
          state.isSearchOpen = !state.isSearchOpen;
          if (!state.isSearchOpen) {
            state.searchQuery = '';
          }
        }),
      clearSearch: () =>
        set((state) => {
          state.searchQuery = '';
          state.isSearchOpen = false;
        }),

      // Scroll
      scrollY: 0,
      setScrollY: (y) =>
        set((state) => {
          state.scrollY = y;
        }),
    })),
    { name: 'UIStore' }
  );
