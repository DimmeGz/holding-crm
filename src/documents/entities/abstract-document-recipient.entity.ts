import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractDocumentWarehouseEntity } from './abstract-document-warehouse.entity';
import { Company } from '../../companies/entities';
import { Warehouse } from '../../warehouse/entities';

@Entity()
export class AbstractDocumentRecipientEntity<
  T,
> extends AbstractDocumentWarehouseEntity<T> {
  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Company;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'recipient_warehouse_id' })
  recipientWarehouse: Warehouse;
}
