import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { DecimalColumnTransformer } from '../../../common/transformers';

import { AbstractDocumentRecipientEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Contract } from '../../contracts/entities';
import { OrderLine } from './order-line.entity';
import { OrderConfirmation } from '../../orders-confirmation/entities';
import { OrderServiceLine } from './order-service-line.entity';

@Entity({ name: 'documents_order' })
export class Order extends AbstractDocumentRecipientEntity<Order> {
  @Column({
    name: 'payment_delay',
    type: 'smallint',
    default: 0,
  })
  paymentDelay: number;

  @Column({
    default: false,
  })
  status: boolean;

  @Column({
    name: 'signature_date',
    type: 'date',
    default: Date.now(),
  })
  signatureDate: Date;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 5,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  vat: number;

  @Column({
    name: 'document_sum',
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  documentSum: number;

  @Column({
    name: 'car_plate',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  carPlate: string;

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

  @Column({
    name: 'confirm_expected_date',
    type: 'date',
    nullable: true,
  })
  confirmExpectedDate: Date;

  @Column({
    name: 'sorting_date',
    type: 'date',
    nullable: true,
  })
  sortingDate: Date;

  @Column({
    name: 'date_asap',
    default: false,
  })
  isDateAsap: boolean;

  @ManyToOne(() => Contract, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @Column({ name: 'contract_id' })
  contractId: number;

  @ManyToOne(() => Incoterms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'incoterms_id' })
  incoterms: Incoterms;

  @Column({ name: 'incoterms_id' })
  incotermsId: number;

  @Column({
    name: 'transport_place',
    type: 'varchar',
    length: 20,
  })
  transportPlace: string;

  @Column({
    name: 'hidden',
    default: false,
  })
  isHidden: boolean;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_order_technical_process',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @OneToMany(() => OrderLine, (orderLine) => orderLine.order, { cascade: true })
  orderLines: Partial<OrderLine>[];

  @OneToMany(
    () => OrderServiceLine,
    (orderServiceLine) => orderServiceLine.order,
    {
      cascade: true,
    },
  )
  orderServiceLines: Partial<OrderServiceLine>[];

  @OneToMany(
    () => OrderConfirmation,
    (orderConfirmation) => orderConfirmation.order,
    { cascade: true },
  )
  orderConfirmations: OrderConfirmation[];
}
