import { TransportService } from '@/services/documents/transports.service';
import type {
  GetTransportDto,
  GetTransportsDto,
} from '@/types/documents/transports.types';
import { useApiData } from '@/hooks/useApiData';

export function useTransports(): {
  data: GetTransportsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetTransportsDto[]>(
    () => TransportService.getList(),
    {
      initialData: [],
    },
  );
}

export function useTransport(transportId: number): {
  data: GetTransportDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const res = useApiData<GetTransportDto>(
    () => TransportService.getById(transportId),
    {
      dependencies: [transportId],
    },
  );
  console.log('res', transportId, res)
  return res;
}

