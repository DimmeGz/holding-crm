import { useEffect, useState } from 'react';
import { OrdersService } from '@/services/documents/orders.service';
import type { GetOrdersDto } from '@/types/documents/orders.types';

export const useUsers: () => {
  data: GetOrdersDto[];
  loading: boolean;
  error: string | null;
} = () => {
  const [data, setData] = useState<GetOrdersDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    OrdersService.getList()
      .then(setData)
      .catch((e: unknown) => {
        const message: string =
          e instanceof Error ? e.message : 'Unknown error';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
