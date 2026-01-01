import { AbstractLineEntity } from '../../entities';
import { Invoice } from './invoice.entity';
import { Batch, Package, Product } from '../../../goods/entities';
import { CountryOfOrigin } from '../../../libs/entities';
import { Order } from '../../orders/entities';
export declare class InvoiceLine extends AbstractLineEntity {
    invoice: Invoice;
    invoiceId: number;
    cost: number;
    product: Product;
    productId: number;
    batch: Batch;
    batchId: number;
    package: Package;
    packageId: number;
    countryOfOrigin: CountryOfOrigin;
    countryOfOriginId: number;
    order: Order;
    orderId: number;
    palletsQty: number;
    grossWeight: number;
}
