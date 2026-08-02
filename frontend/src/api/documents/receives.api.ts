import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateReceivePayload,
  GetReceivesDto,
  Receive,
  UpdateReceivePayload,
} from '@/types/documents/receives.types';

export const receivesApi = {
  getList(): Promise<GetReceivesDto[]> {
    return apiClient.get<GetReceivesDto[]>(UrlConstants.RECEIVES_URL);
  },

  getById(receiveId: number): Promise<Receive> {
    return apiClient.get<Receive>(`${UrlConstants.RECEIVES_URL}/${receiveId}`);
  },

  create(payload: CreateReceivePayload): Promise<Receive> {
    return apiClient.post<Receive>(UrlConstants.RECEIVES_URL, payload);
  },

  update(receiveId: number, payload: UpdateReceivePayload): Promise<Receive> {
    return apiClient.patch<Receive>(
      `${UrlConstants.RECEIVES_URL}/${receiveId}`,
      payload,
    );
  },

  remove(receiveId: number): Promise<Receive> {
    return apiClient.del<Receive>(`${UrlConstants.RECEIVES_URL}/${receiveId}`);
  },

  changeStatus(receiveId: number): Promise<Receive> {
    return apiClient.patch<Receive>(
      `${UrlConstants.RECEIVES_URL}/change-status/${receiveId}`,
    );
  },
};
