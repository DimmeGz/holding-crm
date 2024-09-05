import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Batch, Product } from '../../../goods/entities';
import { Receive } from './receive.entity';

@Entity({ name: 'documents_receiveline' })
export class ReceiveLine extends AbstractLineEntity {
  @ManyToOne(() => Receive, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receive_id' })
  receive: Receive;

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
}
