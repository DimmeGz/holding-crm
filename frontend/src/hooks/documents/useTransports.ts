import { useApiData } from '@/hooks/useApiData';
import { TransportService } from '@/services/documents/transports.service';
import type {
  GetTransportDto,
  GetTransportsDto,
} from '@/types/documents/transports.types';

export function useTransports(): {
  data: GetTransportsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetTransportsDto[]>(() => TransportService.getList(), {
    initialData: [],
  });
}

export function useTransport(
  transportId: number,
  enabled = true,
): {
  data: GetTransportDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetTransportDto>(
    () => TransportService.getById(transportId),
    {
      dependencies: [transportId, enabled],
      enabled: enabled && transportId > 0,
    },
  );
}
