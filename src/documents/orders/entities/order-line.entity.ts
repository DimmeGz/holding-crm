import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Product } from '../../../goods/entities';

@Entity({ name: 'documents_orderline' })
export class OrderLine extends AbstractLineEntity {
  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_man_id' })
  productMan: Product;

  @Column({ name: 'product_man_id' })
  productManId: number;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_buy_id' })
  productBuy: Product;

  @Column({ name: 'product_buy_id' })
  productBuyId: number;

  @Column({
    name: 'batch_rename',
    type: 'varchar',
    length: 10,
  })
  batchRename: string;
}
