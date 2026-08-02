import { useApiData } from '@/hooks/useApiData';
import { OrdersService } from '@/services/documents/orders.service';
import type {
  GetOrderDto,
  GetOrdersDto,
  GetOrdersQuery,
} from '@/types/documents/orders.types';

export function useOrders(query?: GetOrdersQuery): {
  data: GetOrdersDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const queryKey = JSON.stringify(query ?? {});

  return useApiData<GetOrdersDto[]>(() => OrdersService.getList(query), {
    initialData: [],
    dependencies: [queryKey],
  });
}

export function useOrder(
  orderId: number,
  enabled = true,
): {
  data: GetOrderDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetOrderDto>(() => OrdersService.getById(orderId), {
    dependencies: [orderId, enabled],
    enabled: enabled && orderId > 0,
  });
}
