import { useApiData } from '@/hooks/useApiData';
import { WarehouseService } from '@/services/warehouse/warehouse.service';
import type {
  GetWarehouseAccountingDto,
  WarehouseListQuery,
} from '@/types/warehouse/warehouse.types';

export function useWarehouse(query: WarehouseListQuery): {
  data: GetWarehouseAccountingDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetWarehouseAccountingDto[]>(
    () => WarehouseService.getList(query),
    {
      initialData: [],
      dependencies: [query.company, query.warehouse, query.process],
    },
  );
}
