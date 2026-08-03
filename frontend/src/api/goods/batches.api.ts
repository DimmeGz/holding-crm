import { apiClient } from '@/api/api-client';
import { UrlConstants } from '@/constants/url-constants';
import type {
  BatchDetail,
  BatchMutationResult,
  BatchesListGroup,
  BatchesListQuery,
  CreateBatchPayload,
  UpdateBatchPayload,
} from '@/types/goods/batches.types';

function buildListQuery(query?: BatchesListQuery): string {
  if (!query?.process) {
    return '';
  }

  const params = new URLSearchParams();
  params.set('process', String(query.process));
  return `?${params.toString()}`;
}

export const batchesApi = {
  getList(query?: BatchesListQuery): Promise<BatchesListGroup[]> {
    return apiClient.get<BatchesListGroup[]>(
      `${UrlConstants.GOODS_BATCHES_URL}${buildListQuery(query)}`,
    );
  },

  getDetail(batchId: number): Promise<BatchDetail> {
    return apiClient.get<BatchDetail>(
      `${UrlConstants.GOODS_BATCHES_URL}/${batchId}`,
    );
  },

  create(payload: CreateBatchPayload): Promise<BatchMutationResult> {
    return apiClient.post<BatchMutationResult>(
      UrlConstants.GOODS_BATCHES_URL,
      payload,
    );
  },

  update(
    batchId: number,
    payload: UpdateBatchPayload,
  ): Promise<BatchMutationResult> {
    return apiClient.patch<BatchMutationResult>(
      `${UrlConstants.GOODS_BATCHES_URL}/${batchId}`,
      payload,
    );
  },
};
