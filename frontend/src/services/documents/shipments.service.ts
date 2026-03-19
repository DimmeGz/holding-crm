import { shipmentsApi } from '@/api/documents/shipments.api';
import type {
  GetShipmentDto,
  GetShipmentsDto,
} from '@/types/documents/shipments.types';

export class ShipmentsService {
  static async getList(): Promise<GetShipmentsDto[]> {
    const shipments: GetShipmentsDto[] = await shipmentsApi.getList();

    return shipments;
  }

  static async getById(shipmentId: number): Promise<GetShipmentDto> {
    const shipment: GetShipmentDto = await shipmentsApi.getById(shipmentId);

    return shipment;
  }
}
