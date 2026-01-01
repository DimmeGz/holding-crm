import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { Batch, Package, Product } from '../../../goods/entities';
import { Production } from './production.entity';

@Entity({ name: 'documents_productioninline' })
export class ProductionInLine extends AbstractEntity {
  @ManyToOne(() => Production, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'production_id' })
  production: Production;

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
