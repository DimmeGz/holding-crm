import { AbstractEntity } from '../../../common/entities';
import { ProductTransport } from './product-transport.entity';
import { Batch, Package, Product } from '../../../goods/entities';
export declare class ProductTransportLine extends AbstractEntity {
    productTransport: ProductTransport;
    product: Product;
    productId: number;
    batch: Batch;
    batchId: number;
    package: Package;
    packageId: number;
    qty: number;
}
