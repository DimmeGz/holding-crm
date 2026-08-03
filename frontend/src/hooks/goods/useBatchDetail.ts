import { useApiData } from '@/hooks/useApiData';
import { BatchesService } from '@/services/goods/batches.service';
import type { BatchDetail } from '@/types/goods/batches.types';

export function useBatchDetail(batchId: number): {
  data: BatchDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<BatchDetail>(() => BatchesService.getDetail(batchId), {
    dependencies: [batchId],
    enabled: Number.isFinite(batchId) && batchId > 0,
  });
}
