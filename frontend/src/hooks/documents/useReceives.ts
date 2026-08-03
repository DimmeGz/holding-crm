import type { DatedDocumentsListQuery } from '@/helpers/documents-query.helpers';
import { useApiData } from '@/hooks/useApiData';
import { ReceivesService } from '@/services/documents/receives.service';
import type {
  GetReceivesDto,
  Receive,
} from '@/types/documents/receives.types';

export function useReceives(query?: DatedDocumentsListQuery): {
  data: GetReceivesDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const queryKey = JSON.stringify(query ?? {});

  return useApiData<GetReceivesDto[]>(() => ReceivesService.getList(query), {
    initialData: [],
    dependencies: [queryKey],
  });
}

export function useReceive(
  receiveId: number,
  enabled = true,
): {
  data: Receive | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<Receive>(() => ReceivesService.getById(receiveId), {
    dependencies: [receiveId, enabled],
    enabled: enabled && receiveId > 0,
  });
}
