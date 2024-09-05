import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CustomField } from './custom-field.entity';
import { Batch } from './batch.entity';
import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin } from '../../libs/entities';

@Entity({ name: 'warehouse_product' })
export class Product extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 70,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'varchar',
    length: 70,
    nullable: true,
  })
  description2: string;

  @Column({
    name: 'cn_code',
    type: 'bigint',
    unsigned: true,
    nullable: true,
  })
  cnCode: string;

  @ManyToOne(() => CountryOfOrigin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'default_country_of_origin_id' })
  countryOfOrigin: CountryOfOrigin;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  cas: string;

  @ManyToMany(() => CustomField)
  @JoinTable({
    name: 'warehouse_product_custom_fields',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'customfields_id',
      referencedColumnName: 'id',
    },
  })
  customFields: CustomField[];

  @OneToMany(() => Batch, (batch) => batch.product)
  batches: Batch[];
}
