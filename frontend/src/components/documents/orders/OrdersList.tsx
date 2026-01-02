import type { ReactNode } from 'react';
import { useUsers } from '../../../hooks/documents/useOrders';

export function OrdersList(): ReactNode {
  const { data, loading, error } = useUsers();

  console.log(data, loading, error);

  return <></>;
}
