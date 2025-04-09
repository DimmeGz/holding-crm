import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Invoice } from './invoice.entity';
import { Batch, Package, Product } from '../../../goods/entities';
import { CountryOfOrigin } from '../../../libs/entities';
import { Order } from '../../orders/entities';

@Entity({ name: 'documents_invoiceline' })
export class InvoiceLine extends AbstractLineEntity {
  @ManyToOne(() => Invoice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @JoinColumn({ name: 'invoice_id' })
  invoiceId: number;

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

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batchId: number;

  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @JoinColumn({ name: 'package_id' })
  packageId: number;

  @ManyToOne(() => CountryOfOrigin, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'country_of_origin_id' })
  countryOfOrigin: CountryOfOrigin;

  @Column({ name: 'country_of_origin_id' })
  countryOfOriginId: number;

  @ManyToOne(() => Order, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: number;

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
