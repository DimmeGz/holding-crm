import { useEffect, useState } from 'react';

interface UseApiDataOptions<T> {
  initialData?: T;
  dependencies?: unknown[];
  enabled?: boolean;
}

export const useApiData: <T>(
  fetchFn: () => Promise<T>,
  options?: UseApiDataOptions<T> | undefined,
) => {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} = <T>(
  fetchFn: () => Promise<T>,
  options?: UseApiDataOptions<T>,
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} => {
    const [data, setData] = useState<T | null>(options?.initialData ?? null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData: () => void = (): void => {
      if (!options?.enabled) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      fetchFn()
        .then(setData)
        .catch((e: unknown) => {
          const message: string =
            e instanceof Error ? e.message : 'Unknown error';
          setError(message);
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, options?.dependencies || []);

    return { data, loading, error, refetch: fetchData };
  };
