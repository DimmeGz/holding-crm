import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin } from '../../libs/entities';
import { Product } from './product.entity';
import { BatchCustomField } from './batch-custom-field.entity';
import { InvoiceLine } from '../../documents/invoices/entities';
import {
  ProductionInLine,
  ProductionOutLine,
} from '../../documents/production/entities';

@Entity({ name: 'warehouse_batch' })
export class Batch extends AbstractEntity {
  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({
    type: 'varchar',
    length: 16,
    unique: true,
  })
  name: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @ManyToOne(() => CountryOfOrigin, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'default_country_of_origin_id' })
  countryOfOrigin: CountryOfOrigin | null;

  @Column({
    name: 'default_country_of_origin_id',
    nullable: true,
  })
  countryOfOriginId: number | null;

  @OneToMany(() => BatchCustomField, (customField) => customField.batch)
  customFields: BatchCustomField[];

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
