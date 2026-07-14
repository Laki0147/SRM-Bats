/**
 * useOptimistic Hook
 * Provides optimistic updates for mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '@/store';

interface OptimisticUpdateOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: readonly unknown[];
  updater: (oldData: TData | undefined, variables: TVariables) => TData;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: ( TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export const useOptimisticUpdate = <TData, TVariables>({
  mutationFn,
  queryKey,
  updater,
  successMessage,
  errorMessage,
  onSuccess,
  onError,
}: OptimisticUpdateOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();
  const { addToast } = useUIStore();

  return useMutation({
    mutationFn,

    // Optimistic update
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update
      queryClient.setQueryData<TData>(queryKey, (old) => updater(old, variables));

      // Return context with snapshot
      return { previousData };
    },

    // On error, rollback
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      addToast({
        type: 'error',
        message: errorMessage || error.message || 'An error occurred',
        duration: 5000,
      });

      onError?.(error as Error, variables);
    },

    // On success, show toast
    onSuccess: (data, variables) => {
      if (successMessage) {
        addToast({
          type: 'success',
          message: successMessage,
          duration: 3000,
        });
      }

      onSuccess?.(data, variables);
    },

    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

/**
 * Example Usage:
 *
 * const updateCartMutation = useOptimisticUpdate({
 *   mutationFn: async (item: CartItem) => {
 *     const response = await fetch('/api/cart', {
 *       method: 'POST',
 *       body: JSON.stringify(item),
 *     });
 *     return response.json();
 *   },
 *   queryKey: queryKeys.cart.current,
 *   updater: (oldCart, newItem) => {
 *     return {
 *       ...oldCart,
 *       items: [...(oldCart?.items || []), newItem],
 *     };
 *   },
 *   successMessage: 'Item added to cart',
 *   errorMessage: 'Failed to add item',
 * });
 */
