import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractDocumentEntity } from './abstract-document.entity';
import { Warehouse } from '../../warehouse/entities';

@Entity()
export class AbstractDocumentWarehouseEntity<
  T,
> extends AbstractDocumentEntity<T> {
  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'seller_warehouse_id' })
  sellerWarehouse: Warehouse;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_warehouse_id' })
  buyerWarehouse: Warehouse;
}
