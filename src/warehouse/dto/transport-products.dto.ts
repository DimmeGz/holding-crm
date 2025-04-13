import { ProductLine } from './product-line.dto';

export class TransportProductsDTO {
  companyId: number;
  warehouseSenderId: number;
  warehouseReceiveId: number;
  transportLines: ProductLine[];
  transportCost: number;
}
