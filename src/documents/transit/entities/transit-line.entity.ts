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
import { Batch, Package } from '../../../goods/entities';

@Entity({ name: 'documents_transitline' })
export class TransitLine extends AbstractEntity {
  @ManyToOne(() => Shipment, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @Column({ name: 'shipment_id' })
  shipmentId: number;

  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batchId: number;

  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ name: 'package_id' })
  packageId: number;

  @Column({
    type: 'int',
  })
  qty: number;

  @ManyToOne(() => Receive, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receive_id' })
  receive?: Receive;

  @Column({ name: 'receive_id' })
  receiveId?: number;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_transitline_technical_process',
    joinColumn: {
      name: 'transitline_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: Partial<TechnicalProcess>[];

  constructor(entity: Partial<TransitLine>) {
    super();
    Object.assign(this, entity);
  }
}
