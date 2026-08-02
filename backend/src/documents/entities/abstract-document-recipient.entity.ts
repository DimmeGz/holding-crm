import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractDocumentWarehouseEntity } from './abstract-document-warehouse.entity';
import { Company } from '../../companies/entities';
import { Warehouse } from '../../warehouse/entities';

@Entity()
export class AbstractDocumentRecipientEntity<
  T,
> extends AbstractDocumentWarehouseEntity<T> {
  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Company | null;

  @Column({ name: 'recipient_id', nullable: true })
  recipientId: number | null;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'recipient_warehouse_id' })
  recipientWarehouse: Warehouse | null;

  @Column({ name: 'recipient_warehouse_id', nullable: true })
  recipientWarehouseId: number | null;
}
