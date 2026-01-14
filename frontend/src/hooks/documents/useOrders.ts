import { useApiData } from '@/hooks/useApiData';
import { OrdersService } from '@/services/documents/orders.service';
import type { GetOrderDto, GetOrdersDto } from '@/types/documents/orders.types';

export function useOrders(): {
  data: GetOrdersDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetOrdersDto[]>(() => OrdersService.getList(), {
    initialData: [],
  });
}

export function useOrder(orderId: number): {
  data: GetOrderDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetOrderDto>(() => OrdersService.getById(orderId), {
    dependencies: [orderId],
  });
}
