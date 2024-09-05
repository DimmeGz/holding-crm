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

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({
    type: 'int',
  })
  qty: number;
}
