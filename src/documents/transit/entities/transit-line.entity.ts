import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { Shipment } from '../../shipment/entities';
import { Receive } from '../../receive/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { Batch } from '../../../goods/entities';

@Entity({ name: 'documents_transitline' })
export class TransitLine extends AbstractEntity {
  @ManyToOne(() => Shipment, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({
    type: 'int',
  })
  qty: number;

  @ManyToOne(() => Receive, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receive_id' })
  receive: Receive;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_transitline_technical_process',
    joinColumn: {
      name: 'transitline_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
