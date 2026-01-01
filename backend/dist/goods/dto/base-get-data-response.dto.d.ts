import { InvoiceLine } from '../../documents/invoice/entities';
import { ProductionInLine, ProductionOutLine } from '../../documents/production/entities';
export declare class BaseGetDataResponseDTO {
    invoiceLines: InvoiceLine[];
    productionOutLines: ProductionOutLine[];
    productionInLines: ProductionInLine[];
}
