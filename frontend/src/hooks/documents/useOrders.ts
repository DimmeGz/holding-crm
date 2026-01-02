import { useEffect, useState } from 'react';
import { OrdersService } from '../../documents/orders.service';

export const useUsers = () => {
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    OrdersService.getList()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
};
