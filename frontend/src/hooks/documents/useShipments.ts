import type { DatedDocumentsListQuery } from '@/helpers/documents-query.helpers';
import { useApiData } from '@/hooks/useApiData';
import { ShipmentsService } from '@/services/documents/shipments.service';
import type {
  GetShipmentDto,
  GetShipmentsDto,
} from '@/types/documents/shipments.types';

export function useShipments(query?: DatedDocumentsListQuery): {
  data: GetShipmentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const queryKey = JSON.stringify(query ?? {});

  return useApiData<GetShipmentsDto[]>(() => ShipmentsService.getList(query), {
    initialData: [],
    dependencies: [queryKey],
  });
}

export function useShipment(
  shipmentId: number,
  enabled = true,
): {
  data: GetShipmentDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetShipmentDto>(
    () => ShipmentsService.getById(shipmentId),
    {
      dependencies: [shipmentId, enabled],
      enabled: enabled && shipmentId > 0,
    },
  );
}
