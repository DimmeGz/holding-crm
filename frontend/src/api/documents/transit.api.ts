import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type { GetTransitLineDto } from '@/types/documents/transit.types';

export const transitApi = {
  getList(): Promise<GetTransitLineDto[]> {
    return apiClient.get<GetTransitLineDto[]>(UrlConstants.TRANSIT_URL);
  },
};
