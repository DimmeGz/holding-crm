import type { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@/components/shared/Spinner';
import { useOrder } from '@/hooks/documents/useOrders';

export function OrderPage(): ReactNode {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useOrder(Number(id));

  console.log(data);

  return (
    <>
      {loading && <Spinner />}

      {!loading && error && <h3>Помилка завантаження даних: {error}</h3>}
    </>
  );
}
