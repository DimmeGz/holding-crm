import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  CreateProductionPayload,
  GetProductionsDto,
  Production,
  UpdateProductionPayload,
} from '@/types/documents/productions.types';

export const productionsApi = {
  getList(): Promise<GetProductionsDto[]> {
    return apiClient.get<GetProductionsDto[]>(UrlConstants.PRODUCTION_URL);
  },

  getById(productionId: number): Promise<Production> {
    return apiClient.get<Production>(
      `${UrlConstants.PRODUCTION_URL}/${productionId}`,
    );
  },

  create(payload: CreateProductionPayload): Promise<Production> {
    return apiClient.post<Production>(UrlConstants.PRODUCTION_URL, payload);
  },

  update(
    productionId: number,
    payload: UpdateProductionPayload,
  ): Promise<Production> {
    return apiClient.patch<Production>(
      `${UrlConstants.PRODUCTION_URL}/${productionId}`,
      payload,
    );
  },

  remove(productionId: number): Promise<Production> {
    return apiClient.del<Production>(
      `${UrlConstants.PRODUCTION_URL}/${productionId}`,
    );
  },

  changeStatus(productionId: number): Promise<Production> {
    return apiClient.patch<Production>(
      `${UrlConstants.PRODUCTION_URL}/change-status/${productionId}`,
    );
  },
};
