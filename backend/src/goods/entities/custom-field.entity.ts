import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'warehouse_customfields' })
export class CustomField extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 24,
  })
  name: string;

  @Column({
    name: 'description_1',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  description: string;

  @Column({
    name: 'description_2',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  description2: string;

  @Column({
    name: 'default_value',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  defaultValue: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  unit: string;

  @Column({
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  qc: string;

  @Column({
    type: 'smallint',
    default: 0,
  })
  priority: number;
}
