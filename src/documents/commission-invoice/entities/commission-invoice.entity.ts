import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { Invoice } from '../../invoice/entities';
import { TechnicalProcess } from '../../../libs/entities';

@Entity({ name: 'documents_commissioninvoice' })
export class CommissionInvoice extends AbstractDocumentEntity<CommissionInvoice> {
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
    scale: 2,
    default: 0,
  })
  paymentBalance: number;

  @Column({
    name: 'creation_date',
    type: 'date',
    default: Date.now(),
  })
  creationDate: Date;

  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 5,
    scale: 2,
  })
  rate: number;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_commissioninvoice_technical_process',
    joinColumn: {
      name: 'commissioninvoice_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
