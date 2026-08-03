import { useApiData } from '@/hooks/useApiData';
import { WarehouseService } from '@/services/warehouse/warehouse.service';
import type { GetProductReportDto } from '@/types/warehouse/warehouse.types';

export function useProductReport(productId: number): {
  data: GetProductReportDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetProductReportDto>(
    () => WarehouseService.getProductReport(productId),
    {
      enabled: Number.isFinite(productId) && productId > 0,
      dependencies: [productId],
    },
  );
}
