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
import { CommissionInvoice } from '../../commission-invoice/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { CommissionPaymentLine } from './commission-payment-line.entity';

@Entity({ name: 'documents_commissionpayment' })
export class CommissionPayment extends AbstractDocumentEntity<CommissionPayment> {
  @ManyToOne(() => CommissionInvoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'commission_invoice_id' })
  commissionInvoice: CommissionInvoice;

  @Column({ name: 'commission_invoice_id' })
  commissionInvoiceId: number;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_commissionpayment_technical_process',
    joinColumn: {
      name: 'commissionpayment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @OneToMany(
    () => CommissionPaymentLine,
    (commissionPaymentLine) => commissionPaymentLine.commissionPayment,
    {
      cascade: true,
    }
  )
  commissionPaymentLines: Partial<CommissionPaymentLine>[];
}
