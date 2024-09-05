import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin } from '../../libs/entities';
import { Product } from './product.entity';

@Entity({ name: 'warehouse_batch' })
export class Batch extends AbstractEntity {
  @ManyToOne(() => Product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'varchar',
    length: 16,
    unique: true,
  })
  name: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @ManyToOne(() => CountryOfOrigin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'default_country_of_origin_id' })
  countryOfOrigin: CountryOfOrigin;
}
