import { ProductLine } from './product-line.dto';

export class MakeProductionDTO {
  status: boolean;
  companyId: number;
  warehouseId: number;
  outLines: ProductLine[];
  inLines: ProductLine[];
}
