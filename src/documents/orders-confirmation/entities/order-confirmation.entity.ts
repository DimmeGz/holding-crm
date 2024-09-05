import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractDocumentRecipientEntity } from '../../entities';
import { Currency, Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Order } from '../../orders/entities';

@Entity({ name: 'documents_orderconfirmation' })
export class OrderConfirmation extends AbstractDocumentRecipientEntity<OrderConfirmation> {
  @Column({
    name: 'payment_delay',
    type: 'smallint',
    default: 0,
  })
  paymentDelay: number;

  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

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
}
