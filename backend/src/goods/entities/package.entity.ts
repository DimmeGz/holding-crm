import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'documents_package' })
export class Package extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
  })
  name: string;

  @Column({
    type: 'int',
    unsigned: true,
  })
  capacity: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 1,
  })
  weight: number;

  @Column({
    name: 'qty_per_pallet',
    type: 'int',
    unsigned: true,
    default: 1,
  })
  qtyPerPallet: number;
}
