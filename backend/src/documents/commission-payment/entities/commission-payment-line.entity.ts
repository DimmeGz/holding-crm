import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommissionPayment } from './commission-payment.entity';
import { CommissionInvoice } from '../../../documents/commission-invoice/entities';
import { AbstractEntity } from '../../../common/entities';

@Entity({ name: 'documents_commissionpaymentline', schema: 'ivan_igantiev_2557' })
export class CommissionPaymentLine extends AbstractEntity {
  @ManyToOne(() => CommissionPayment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commission_payment_id' })
  commissionPayment: CommissionPayment;

  @ManyToOne(() => CommissionInvoice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'commission_invoice_id' })
  commissionInvoice: CommissionInvoice;

  @Column({ name: 'commission_invoice_id' })
  commissionInvoiceId: number

  @Column({ name: 'amount' })
  amount: number;
}
