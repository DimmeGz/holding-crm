import { shipmentsApi } from '@/api/documents/shipments.api';
import type { DatedDocumentsListQuery } from '@/helpers/documents-query.helpers';
import type {
  CreateShipmentPayload,
  GetShipmentDto,
  GetShipmentsDto,
  Shipment,
  UpdateShipmentPayload,
} from '@/types/documents/shipments.types';

export class ShipmentsService {
  static async getList(
    query?: DatedDocumentsListQuery,
  ): Promise<GetShipmentsDto[]> {
    return shipmentsApi.getList(query);
  }

  static async getById(shipmentId: number): Promise<GetShipmentDto> {
    return shipmentsApi.getById(shipmentId);
  }

  static async create(payload: CreateShipmentPayload): Promise<Shipment> {
    return shipmentsApi.create(payload);
  }

  static async update(
    shipmentId: number,
    payload: UpdateShipmentPayload,
  ): Promise<Shipment> {
    return shipmentsApi.update(shipmentId, payload);
  }

  static async remove(shipmentId: number): Promise<Shipment> {
    return shipmentsApi.remove(shipmentId);
  }

  static async changeStatus(shipmentId: number): Promise<Shipment> {
    return shipmentsApi.changeStatus(shipmentId);
  }
}
