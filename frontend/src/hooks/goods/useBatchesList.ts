import { useApiData } from '@/hooks/useApiData';
import { BatchesService } from '@/services/goods/batches.service';
import type {
  BatchesListGroup,
  BatchesListQuery,
} from '@/types/goods/batches.types';

export function useBatchesList(query: BatchesListQuery): {
  data: BatchesListGroup[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<BatchesListGroup[]>(
    () => BatchesService.getList(query),
    {
      initialData: [],
      dependencies: [query.process],
    },
  );
}
