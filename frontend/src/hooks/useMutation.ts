import { useCallback, useRef, useState } from 'react';

interface UseMutationOptions<TData> {
  onSuccess?: (data: TData) => void;
  onError?: (message: string) => void;
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData>,
): {
  mutate: (variables: TVariables) => void;
  mutateAsync: (variables: TVariables) => Promise<TData>;
  loading: boolean;
  error: string | null;
  reset: () => void;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const reset = useCallback((): void => {
    setError(null);
    setLoading(false);
  }, []);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setLoading(true);
      setError(null);

      try {
        const data = await mutationFn(variables);
        optionsRef.current?.onSuccess?.(data);
        return data;
      } catch (e: unknown) {
        const message =
          e && typeof e === 'object' && 'message' in e
            ? String((e as { message: string }).message)
            : 'Unknown error';
        setError(message);
        optionsRef.current?.onError?.(message);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn],
  );

  const mutate = useCallback(
    (variables: TVariables): void => {
      void mutateAsync(variables);
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, loading, error, reset };
}
