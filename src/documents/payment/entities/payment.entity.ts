import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { TechnicalProcess } from '../../../libs/entities';
import { PaymentLine } from './payment-line.entity';

@Entity({ name: 'documents_payment' })
export class Payment extends AbstractDocumentEntity<Payment> {
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
    default: false,
  })
  status: boolean;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_payment_technical_process',
    joinColumn: {
      name: 'payment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @OneToMany(() => PaymentLine, (paymentLine) => paymentLine.payment, {
    cascade: true,
  })
  paymentLines: PaymentLine[];
}
