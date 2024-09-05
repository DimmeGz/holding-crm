import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Product } from '../../../goods/entities';

@Entity({ name: 'documents_orderline' })
export class OrderLine extends AbstractLineEntity {
  @ManyToOne(() => Order, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

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
