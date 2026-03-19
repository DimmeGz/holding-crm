import { useApiData } from '@/hooks/useApiData';
import { ShipmentsService } from '@/services/documents/shipments.service';
import type {
  GetShipmentDto,
  GetShipmentsDto,
} from '@/types/documents/shipments.types';

export function useShipments(): {
  data: GetShipmentsDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetShipmentsDto[]>(() => ShipmentsService.getList(), {
    initialData: [],
  });
}

export function useShipment(shipmentId: number): {
  data: GetShipmentDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  return useApiData<GetShipmentDto>(
    () => ShipmentsService.getById(shipmentId),
    {
      dependencies: [shipmentId],
    },
  );
}
