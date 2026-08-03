import { batchesApi } from '@/api/goods/batches.api';
import type {
  BatchDetail,
  BatchMutationResult,
  BatchesListGroup,
  BatchesListQuery,
  CreateBatchPayload,
  UpdateBatchPayload,
} from '@/types/goods/batches.types';

export class BatchesService {
  static getList(query?: BatchesListQuery): Promise<BatchesListGroup[]> {
    return batchesApi.getList(query);
  }

  static getDetail(batchId: number): Promise<BatchDetail> {
    return batchesApi.getDetail(batchId);
  }

  static create(payload: CreateBatchPayload): Promise<BatchMutationResult> {
    return batchesApi.create(payload);
  }

  static update(
    batchId: number,
    payload: UpdateBatchPayload,
  ): Promise<BatchMutationResult> {
    return batchesApi.update(batchId, payload);
  }
}
