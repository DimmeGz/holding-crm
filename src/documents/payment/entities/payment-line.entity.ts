import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { Payment } from './payment.entity';
import { Invoice } from '../../invoice/entities';

@Entity({ name: 'documents_paymentline' })
export class PaymentLine extends AbstractEntity {
  @ManyToOne(() => Payment, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 3,
  })
  amount: number;
}
