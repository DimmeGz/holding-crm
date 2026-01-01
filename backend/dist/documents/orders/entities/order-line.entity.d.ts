import { AbstractLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Product } from '../../../goods/entities';
export declare class OrderLine extends AbstractLineEntity {
    order: Order;
    productMan: Product;
    productManId: number;
    productBuy: Product;
    productBuyId: number;
    batchRename: string;
}
