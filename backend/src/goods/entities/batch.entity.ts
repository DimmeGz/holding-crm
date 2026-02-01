import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin } from '../../libs/entities';
import { Product } from './product.entity';
import { InvoiceLine } from '../../documents/invoices/entities';
import {
  ProductionInLine,
  ProductionOutLine,
} from '../../documents/production/entities';

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

  @OneToMany(() => InvoiceLine, (invoiceLine) => invoiceLine.batch)
  invoiceLines: InvoiceLine[];

  @OneToMany(
    () => ProductionInLine,
    (productionInLine) => productionInLine.batch,
  )
  productionInLines: ProductionInLine[];

  @OneToMany(
    () => ProductionOutLine,
    (productionOutLine) => productionOutLine.batch,
  )
  productionOutLines: ProductionOutLine[];
}
