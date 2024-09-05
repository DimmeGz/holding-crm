import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'warehouse_service' })
export class Service extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  name: string;
}
