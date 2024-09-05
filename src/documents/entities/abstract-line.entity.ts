import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Package } from '../../goods/entities';
import { AbstractServiceLineEntity } from './abstract-service-line.entity';

@Entity()
export class AbstractLineEntity extends AbstractServiceLineEntity {
  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;
}
