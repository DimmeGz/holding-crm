import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { TechnicalProcess } from '../../libs/entities';

@Entity({ name: 'warehouse_service' })
export class Service extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  name: string;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'warehouse_technicalprocess_service',
    joinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
