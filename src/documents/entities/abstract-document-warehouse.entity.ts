import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

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

  @Column({ name: 'seller_warehouse_id' })
  sellerWarehouseId: number;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_warehouse_id' })
  buyerWarehouse: Warehouse;

  @Column({ name: 'buyer_warehouse_id' })
  buyerWarehouseId: number;
}
