import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';
import { Invoice } from './invoice.entity';
import { Service } from '../../../goods/entities';

@Entity({ name: 'documents_invoiceserviceline' })
export class InvoiceServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
