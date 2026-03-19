import type {
  GetTransportsDto,
  GetTransportDto,
} from '@/types/documents/transports.types';
import { transportsApi } from '@/api/documents/transports.api';

export class TransportService {
  static async getList(): Promise<GetTransportsDto[]> {
    const shipments: GetTransportsDto[] = await transportsApi.getList();

    return shipments;
  }

  static async getById(shipmentId: number): Promise<GetTransportDto> {
    const shipment: GetTransportDto = await transportsApi.getById(shipmentId);

    return shipment;
  }
}
