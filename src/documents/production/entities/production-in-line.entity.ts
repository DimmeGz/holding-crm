import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { Batch, Package, Product } from '../../../goods/entities';
import { Production } from './production.entity';

@Entity({ name: 'documents_productioninline' })
export class ProductionInLine extends AbstractEntity {
  @ManyToOne(() => Production, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'production_id' })
  production: Production;

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
