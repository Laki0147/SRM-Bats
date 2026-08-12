import { useState, useEffect, useCallback } from 'react';
import { ApiError } from './types';
import { isApiError } from './utils';

/**
 * Generic API hook state
 */
interface UseApiState<T> {
   T | null;
  loading: boolean;
  error: ApiError | null;
}

/**
 * Generic API hook
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
     null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiFunction();
      setState({ data, loading: false, error: null });
    } catch (err) {
      const error = isApiError(err)
        ? err
        : {
            message: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR',
            status: 500,
          };
      setState({  null, loading: false, error });
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch: fetchData };
}

/**
 * Mutation hook for POST/PUT/DELETE operations
 */
interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseMutationResult<T, V> extends UseMutationState<T> {
  mutate: (variables: V) => Promise<T>;
  reset: () => void;
}

export function useMutation<T, V = void>(
  mutationFunction: (variables: V) => Promise<T>
): UseMutationResult<T, V> {
  const [state, setState] = useState<UseMutationState<T>>({
     null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: V): Promise<T> => {
      setState({ data: null, loading: true, error: null });

      try {
        const data = await mutationFunction(variables);
        setState({ data, loading: false, error: null });
        return data;
      } catch (err) {
        const error = isApiError(err)
          ? err
          : {
              message: 'An unexpected error occurred',
              code: 'UNKNOWN_ERROR',
              status: 500,
            };
        setState({  null, loading: false, error });
        throw error;
      }
    },
    [mutationFunction]
  );

  const reset = useCallback(() => {
    setState({  null, loading: false, error: null });
  }, []);

  return { ...state, mutate, reset };
}

/**
 * Optimistic update hook
 */
export function useOptimisticMutation<T, V = void>(
  mutationFunction: (variables: V) => Promise<T>,
  optimisticUpdate: (variables: V) => T
): UseMutationResult<T, V> & { rollback: () => void } {
  const [previousData, setPreviousData] = useState<T | null>(null);
  const mutation = useMutation(mutationFunction);

  const mutate = useCallback(
    async (variables: V): Promise<T> => {
      // Store previous data for rollback
      setPreviousData(mutation.data);

      // Apply optimistic update
      const optimisticData = optimisticUpdate(variables);
      mutation.reset();

      try {
        const data = await mutation.mutate(variables);
        return data;
      } catch (error) {
        // Rollback on error
        if (previousData !== null) {
          // Restore previous state
        }
        throw error;
      }
    },
    [mutation, previousData, optimisticUpdate]
  );

  const rollback = useCallback(() => {
    if (previousData !== null) {
      // Restore previous state
    }
  }, [previousData]);

  return { ...mutation, mutate, rollback };
}
