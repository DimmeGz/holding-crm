import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { CommissionInvoice } from '../../commission-invoice/entities';
import { TechnicalProcess } from '../../../libs/entities';

@Entity({ name: 'documents_commissionpayment' })
export class CommissionPayment extends AbstractDocumentEntity<CommissionPayment> {
  @ManyToOne(() => CommissionInvoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'commission_invoice_id' })
  commissionInvoice: CommissionInvoice;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
  })
  amount: number;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_commissionpayment_technical_process',
    joinColumn: {
      name: 'commissionpayment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
