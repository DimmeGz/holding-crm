import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { Currency, Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Order } from '../../orders/entities';
import { Warehouse } from '../../../warehouse/entities';
import { Company } from '../../../companies/entities';
import { AbstractEntity } from '../../../common/entities';

@Entity({ name: 'documents_orderconfirmation' })
export class OrderConfirmation extends AbstractEntity {
  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'seller_id' })
  seller: Company;

  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Company;

  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  comment: string;

  @CreateDateColumn({
    precision: 0,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  // created_by

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'seller_warehouse_id' })
  sellerWarehouse: Warehouse;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_warehouse_id' })
  buyerWarehouse: Warehouse;

  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Company;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'recipient_warehouse_id' })
  recipientWarehouse: Warehouse;

  @Column({
    name: 'payment_delay',
    type: 'smallint',
    default: 0,
  })
  paymentDelay: number;

  @ManyToOne(() => Order, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({
    name: 'number',
    type: 'varchar',
    length: 15,
    unique: true,
  })
  orderNumber: string;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @ManyToOne(() => Incoterms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'incoterms_id' })
  incoterms: Incoterms;

  @Column({
    name: 'transport_place',
    type: 'varchar',
    length: 20,
  })
  transportPlace: string;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_orderconfirmation_technical_process',
    joinColumn: {
      name: 'orderconfirmation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  constructor(entity: Partial<OrderConfirmation>) {
    super();
    Object.assign(this, entity);
  }
}
