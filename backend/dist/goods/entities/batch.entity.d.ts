import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin } from '../../libs/entities';
import { Product } from './product.entity';
import { InvoiceLine } from '../../documents/invoice/entities';
import { ProductionInLine, ProductionOutLine } from '../../documents/production/entities';
export declare class Batch extends AbstractEntity {
    product: Product;
    name: string;
    isArchived: boolean;
    countryOfOrigin: CountryOfOrigin;
    invoiceLines: InvoiceLine[];
    productionInLines: ProductionInLine[];
    productionOutLines: ProductionOutLine[];
}
