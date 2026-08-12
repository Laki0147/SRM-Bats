/**
 * useWishlist Hook
 * Provides wishlist operations with optimistic updates
 */

import { useWishlistStore } from '@/store';
import { useUIStore } from '@/store';
import { WishlistItem } from '@/store/wishlistStore';
import { useCallback } from 'react';
import { useCart } from './useCart';

export const useWishlist = () => {
  const { items, addItem, removeItem, toggleItem, isInWishlist, clearWishlist } =
    useWishlistStore();
  const { addToast } = useUIStore();
  const { addItem: addToCart } = useCart();

  // Toggle with toast notification
  const handleToggleItem = useCallback(
    (item: Omit<WishlistItem, 'addedAt'>) => {
      const wasInWishlist = isInWishlist(item.productId);
      toggleItem(item);

      addToast({
        type: wasInWishlist ? 'info' : 'success',
        message: wasInWishlist
          ? `${item.name} removed from wishlist`
          : `${item.name} added to wishlist`,
        duration: 3000,
      });
    },
    [isInWishlist, toggleItem, addToast]
  );

  // Add with toast
  const handleAddItem = useCallback(
    (item: Omit<WishlistItem, 'addedAt'>) => {
      if (isInWishlist(item.productId)) {
        addToast({
          type: 'info',
          message: 'Item already in wishlist',
          duration: 3000,
        });
        return;
      }

      addItem(item);
      addToast({
        type: 'success',
        message: `${item.name} added to wishlist`,
        duration: 3000,
      });
    },
    [isInWishlist, addItem, addToast]
  );

  // Remove with toast
  const handleRemoveItem = useCallback(
    (itemId: string, itemName?: string) => {
      removeItem(itemId);
      addToast({
        type: 'info',
        message: `${itemName || 'Item'} removed from wishlist`,
        duration: 3000,
      });
    },
    [removeItem, addToast]
  );

  // Move to cart
  const moveToCart = useCallback(
    (item: WishlistItem) => {
      addToCart({
        id: item.id,
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        stock: 100, // Would come from API
        quantity: 1,
      });
      removeItem(item.id);

      addToast({
        type: 'success',
        message: `${item.name} moved to cart`,
        duration: 3000,
      });
    },
    [addToCart, removeItem, addToast]
  );

  // Clear with confirmation
  const handleClearWishlist = useCallback(() => {
    if (items.length === 0) return;

    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      clearWishlist();
      addToast({
        type: 'info',
        message: 'Wishlist cleared',
        duration: 3000,
      });
    }
  }, [items.length, clearWishlist, addToast]);

  return {
    // State
    items,
    isEmpty: items.length === 0,
    count: items.length,

    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    toggleItem: handleToggleItem,
    clearWishlist: handleClearWishlist,
    moveToCart,

    // Helpers
    isInWishlist,
  };
};
