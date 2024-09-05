import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Invoice } from './invoice.entity';
import { Batch, Product } from '../../../goods/entities';
import { CountryOfOrigin } from '../../../libs/entities';
import { Order } from '../../orders/entities';

@Entity({ name: 'documents_invoiceline' })
export class InvoiceLine extends AbstractLineEntity {
  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 12,
    scale: 3,
  })
  cost: number;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => CountryOfOrigin, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'country_of_origin' })
  countryOfOrigin: CountryOfOrigin;

  @ManyToOne(() => Order, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'pallets_qty',
    type: 'smallint',
    unsigned: true,
  })
  palletsQty: number;

  @Column({
    name: 'gross_weight',
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
    nullable: true,
  })
  grossWeight: number;
}
