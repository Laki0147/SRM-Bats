/**
 * Root Store Export
 * Centralizes all Zustand stores for the application
 */

export { useAuthStore } from './authStore';
export { useCartStore } from './cartStore';
export { useWishlistStore } from './wishlistStore';
export { useRecentlyViewedStore } from './recentlyViewedStore';
export { usePreferencesStore } from './preferencesStore';
export { useUIStore } from './uiStore';

// Re-export types
export type { AuthState } from './authStore';
export type { CartState, CartItem } from './cartStore';
export type { WishlistState } from './wishlistStore';
export type { RecentlyViewedState } from './recentlyViewedStore';
export type { PreferencesState } from './preferencesStore';
export type { UIState } from './uiStore';
