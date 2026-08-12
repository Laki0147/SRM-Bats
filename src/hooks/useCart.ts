/**
 * useCart Hook
 * Provides cart operations with optimistic updates and error handling
 */

import { useCartStore } from '@/store';
import { useUIStore } from '@/store';
import { CartItem } from '@/store/cartStore';
import { useCallback } from 'react';

export const useCart = () => {
  const {
    items,
    itemCount,
    subtotal,
    totalDiscount,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading,
    error,
  } = useCartStore();

  const { addToast, toggleCartDrawer } = useUIStore();

  // Add item with toast notification
  const handleAddItem = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      try {
        addItem(item);
        addToast({
          type: 'success',
          message: `${item.name} added to cart`,
          duration: 3000,
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to add item',
          duration: 5000,
        });
      }
    },
    [addItem, addToast]
  );

  // Remove item with confirmation
  const handleRemoveItem = useCallback(
    (itemId: string, itemName?: string) => {
      removeItem(itemId);
      addToast({
        type: 'info',
        message: `${itemName || 'Item'} removed from cart`,
        duration: 3000,
      });
    },
    [removeItem, addToast]
  );

  // Update quantity with validation
  const handleUpdateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      try {
        updateQuantity(itemId, quantity);
      } catch (error) {
        addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Failed to update quantity',
          duration: 5000,
        });
      }
    },
    [updateQuantity, addToast]
  );

  // Clear cart with confirmation
  const handleClearCart = useCallback(() => {
    if (items.length === 0) return;

    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      addToast({
        type: 'info',
        message: 'Cart cleared',
        duration: 3000,
      });
    }
  }, [items.length, clearCart, addToast]);

  // Add to cart and open drawer
  const addAndShowCart = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      handleAddItem(item);
      toggleCartDrawer();
    },
    [handleAddItem, toggleCartDrawer]
  );

  // Check if product is in cart
  const isInCart = useCallback(
    (productId: string, variant?: CartItem['variant']) => {
      return items.some(
        (item) =>
          item.productId === productId &&
          (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
      );
    },
    [items]
  );

  // Get cart item by product ID
  const getCartItem = useCallback(
    (productId: string, variant?: CartItem['variant']) => {
      return items.find(
        (item) =>
          item.productId === productId &&
          (!variant || JSON.stringify(item.variant) === JSON.stringify(variant))
      );
    },
    [items]
  );

  return {
    // State
    items,
    itemCount,
    subtotal,
    totalDiscount,
    total,
    isLoading,
    error,
    isEmpty: items.length === 0,

    // Actions
    addItem: handleAddItem,
    removeItem: handleRemoveItem,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    addAndShowCart,

    // Helpers
    isInCart,
    getCartItem,
  };
};
