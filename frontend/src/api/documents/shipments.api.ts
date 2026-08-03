import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import {
  buildDocumentsQueryString,
  type DatedDocumentsListQuery,
} from '@/helpers/documents-query.helpers';
import type {
  CreateShipmentPayload,
  GetShipmentDto,
  GetShipmentsDto,
  Shipment,
  UpdateShipmentPayload,
} from '@/types/documents/shipments.types';

export const shipmentsApi = {
  getList(query?: DatedDocumentsListQuery): Promise<GetShipmentsDto[]> {
    return apiClient.get<GetShipmentsDto[]>(
      `${UrlConstants.SHIPMENTS_URL}${buildDocumentsQueryString(query)}`,
    );
  },

  getById(shipmentId: number): Promise<GetShipmentDto> {
    return apiClient.get<GetShipmentDto>(
      `${UrlConstants.SHIPMENTS_URL}/${shipmentId}`,
    );
  },

  create(payload: CreateShipmentPayload): Promise<Shipment> {
    return apiClient.post<Shipment>(UrlConstants.SHIPMENTS_URL, payload);
  },

  update(
    shipmentId: number,
    payload: UpdateShipmentPayload,
  ): Promise<Shipment> {
    return apiClient.patch<Shipment>(
      `${UrlConstants.SHIPMENTS_URL}/${shipmentId}`,
      payload,
    );
  },

  remove(shipmentId: number): Promise<Shipment> {
    return apiClient.del<Shipment>(
      `${UrlConstants.SHIPMENTS_URL}/${shipmentId}`,
    );
  },

  changeStatus(shipmentId: number): Promise<Shipment> {
    return apiClient.patch<Shipment>(
      `${UrlConstants.SHIPMENTS_URL}/change-status/${shipmentId}`,
    );
  },
};
