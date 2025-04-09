import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Batch, Product } from '../../../goods/entities';
import { Shipment } from './shipment.entity';

@Entity({ name: 'documents_shipmentline' })
export class ShipmentLine extends AbstractLineEntity {
  @ManyToOne(() => Shipment, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batchId: number;
}
