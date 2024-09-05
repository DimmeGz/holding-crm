import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/entities';

@Entity()
export class AbstractServiceLineEntity extends AbstractEntity {
  @Column({ type: 'smallint', unsigned: true, default: 1 })
  qty: number;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 12,
    scale: 3,
  })
  price: number;
}
