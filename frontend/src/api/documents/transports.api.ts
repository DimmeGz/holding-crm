import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateTransportPayload,
  GetTransportDto,
  GetTransportsDto,
  UpdateTransportPayload,
} from '@/types/documents/transports.types';

export const transportsApi = {
  getList(): Promise<GetTransportsDto[]> {
    return apiClient.get<GetTransportsDto[]>(UrlConstants.TRANSPORT_URL);
  },

  getById(transportId: number): Promise<GetTransportDto> {
    return apiClient.get<GetTransportDto>(
      `${UrlConstants.TRANSPORT_URL}/${transportId}`,
    );
  },

  create(payload: CreateTransportPayload): Promise<GetTransportDto> {
    return apiClient.post<GetTransportDto>(UrlConstants.TRANSPORT_URL, payload);
  },

  update(
    transportId: number,
    payload: UpdateTransportPayload,
  ): Promise<GetTransportDto> {
    return apiClient.patch<GetTransportDto>(
      `${UrlConstants.TRANSPORT_URL}/${transportId}`,
      payload,
    );
  },

  remove(transportId: number): Promise<GetTransportDto> {
    return apiClient.del<GetTransportDto>(
      `${UrlConstants.TRANSPORT_URL}/${transportId}`,
    );
  },

  changeStatus(transportId: number): Promise<GetTransportDto> {
    return apiClient.patch<GetTransportDto>(
      `${UrlConstants.TRANSPORT_URL}/change-status/${transportId}`,
    );
  },
};
