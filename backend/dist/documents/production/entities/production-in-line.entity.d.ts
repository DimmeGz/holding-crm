import { AbstractEntity } from '../../../common/entities';
import { Batch, Package, Product } from '../../../goods/entities';
import { Production } from './production.entity';
export declare class ProductionInLine extends AbstractEntity {
    production: Production;
    product: Product;
    productId: number;
    batch: Batch;
    batchId: number;
    package: Package;
    packageId: number;
    qty: number;
}
