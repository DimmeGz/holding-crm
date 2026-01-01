import { AbstractLineEntity } from '../../entities';
import { Batch, Product } from '../../../goods/entities';
import { Receive } from './receive.entity';
export declare class ReceiveLine extends AbstractLineEntity {
    receive: Receive;
    product: Product;
    productId: number;
    batch: Batch;
    batchId: number;
}
