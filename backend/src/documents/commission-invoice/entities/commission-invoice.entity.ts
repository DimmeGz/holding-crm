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

import { AbstractDocumentEntity } from '../../entities';
import { Invoice } from '../../invoices/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { CommissionPayment } from '../../commission-payment/entities';

@Entity({ name: 'documents_commissioninvoice' })
export class CommissionInvoice extends AbstractDocumentEntity<CommissionInvoice> {
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
    name: 'payment_balance',
    type: 'decimal',
    unsigned: true,
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
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

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 5,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
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
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: Partial<TechnicalProcess>[];

  @OneToMany(
    () => CommissionPayment,
    (commissionPayment) => commissionPayment.commissionInvoice,
    {
      cascade: true,
    },
  )
  commissionPayments: Partial<CommissionPayment>[];
}
