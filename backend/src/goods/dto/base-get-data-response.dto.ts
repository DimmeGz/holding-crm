import { InvoiceLine } from '../../documents/invoices/entities';
import {
  ProductionInLine,
  ProductionOutLine,
} from '../../documents/production/entities';

export class BaseGetDataResponseDTO {
  invoiceLines: InvoiceLine[];
  productionOutLines: ProductionOutLine[];
  productionInLines: ProductionInLine[];
}
