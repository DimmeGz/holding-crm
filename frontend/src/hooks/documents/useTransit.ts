import { useApiData } from '@/hooks/useApiData';
import { TransitService } from '@/services/documents/transit.service';
import type { GetTransitLineDto } from '@/types/documents/transit.types';

export function useTransit(): {
  data: GetTransitLineDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetTransitLineDto[]>(() => TransitService.getList(), {
    initialData: [],
  });
}
