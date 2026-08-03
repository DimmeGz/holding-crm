import { useApiData } from '@/hooks/useApiData';
import { WarehouseService } from '@/services/warehouse/warehouse.service';
import type { GetBatchReportDto } from '@/types/warehouse/warehouse.types';

export function useBatchReport(batchId: number): {
  data: GetBatchReportDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetBatchReportDto>(
    () => WarehouseService.getBatchReport(batchId),
    {
      enabled: Number.isFinite(batchId) && batchId > 0,
      dependencies: [batchId],
    },
  );
}
