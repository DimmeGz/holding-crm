import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { ProductTransport } from './product-transport.entity';
import { Batch, Package, Product } from '../../../goods/entities';

@Entity({ name: 'documents_producttransportline' })
export class ProductTransportLine extends AbstractEntity {
  @ManyToOne(() => ProductTransport, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'goods_transport_id' })
  productTransport: ProductTransport;

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

  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ name: 'package_id' })
  packageId: number;

  @Column({
    type: 'int',
  })
  qty: number;
}
