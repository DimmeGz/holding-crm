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

@Entity({ name: 'documents_invoice' })
export class Invoice extends AbstractDocumentRecipientEntity<Invoice> {
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

  @Column({
    default: false,
  })
  status: boolean;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 5,
    scale: 2,
    default: 0,
  })
  vat: number;

  @Column({
    name: 'document_sum',
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 3,
    default: 0,
  })
  documentSum: number;

  @Column({
    name: 'payment_balance',
    type: 'decimal',
    unsigned: true,
    precision: 10,
    scale: 3,
    default: 0,
  })
  paymentBalance: number;

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
  invoiceNumber: string;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  // parent

  @Column({
    name: 'separation',
    default: false,
  })
  separation: boolean;

  @Column({
    name: 'report_period',
    type: 'date',
    nullable: true,
  })
  reportPeriod: Date;

  @Column({
    type: 'smallint',
    nullable: true,
  })
  ponz: number;

  @Column({
    name: 'gross_weight',
    type: 'smallint',
    unsigned: true,
    nullable: true,
  })
  grossWeight: number;

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

  @Column({
    name: 'transport_amount',
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
    default: 0,
  })
  transportAmount: number;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_invoice_technical_process',
    joinColumn: {
      name: 'invoice_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @Column({
    name: 'contract_info',
    type: 'varchar',
    length: 200,
  })
  contractInfo: string;
}
