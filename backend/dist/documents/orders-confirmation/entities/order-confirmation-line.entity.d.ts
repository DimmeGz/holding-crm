import { AbstractLineEntity } from '../../entities';
import { OrderConfirmation } from './order-confirmation.entity';
import { Product } from '../../../goods/entities';
export declare class OrderConfirmationLine extends AbstractLineEntity {
    orderConfirmation: OrderConfirmation;
    productMan: Product;
    productBuy: Product;
}
