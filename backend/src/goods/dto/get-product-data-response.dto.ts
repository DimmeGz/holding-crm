import { Product } from '../entities';
import { BaseGetDataResponseDTO } from './base-get-data-response.dto';

export class GetProductDataResponseDTO extends BaseGetDataResponseDTO {
  product: Product;
}
