import { AbstractLineEntity } from '../../entities';
import { Batch, Product } from '../../../goods/entities';
import { Shipment } from './shipment.entity';
export declare class ShipmentLine extends AbstractLineEntity {
    shipment: Shipment;
    product: Product;
    productId: number;
    batch: Batch;
    batchId: number;
}
