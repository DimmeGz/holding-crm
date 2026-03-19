import { useApiData } from '@/hooks/useApiData';
import { ProductionsService } from '@/services/documents/productions.service';
import type {
  GetProductionsDto,
  Production,
} from '@/types/documents/productions.types';

export function useProductions(): {
  data: GetProductionsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetProductionsDto[]>(() => ProductionsService.getList(), {
    initialData: [],
  });
}

export function useProduction(productionId: number): {
  data: Production | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<Production>(
    () => ProductionsService.getById(productionId),
    {
      dependencies: [productionId],
    },
  );
}
