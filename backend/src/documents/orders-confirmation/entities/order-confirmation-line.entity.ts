import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { OrderConfirmation } from './order-confirmation.entity';
import { Product } from '../../../goods/entities';

@Entity({ name: 'documents_confirmationorderline' })
export class OrderConfirmationLine extends AbstractLineEntity {
  @ManyToOne(() => OrderConfirmation, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_confirmation_id' })
  orderConfirmation: OrderConfirmation;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_man_id' })
  productMan: Product;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_buy_id' })
  productBuy: Product;
}
