import { Batch } from '../entities';
import { BaseGetDataResponseDTO } from './base-get-data-response.dto';

export class GetBatchDataResponseDTO extends BaseGetDataResponseDTO {
  batch: Batch;
}
