import { useApiData } from '@/hooks/useApiData';
import { ReceivesService } from '@/services/documents/receives.service';
import type {
  GetReceivesDto,
  Receive,
} from '@/types/documents/receives.types';

export function useReceives(): {
  data: GetReceivesDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetReceivesDto[]>(() => ReceivesService.getList(), {
    initialData: [],
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
