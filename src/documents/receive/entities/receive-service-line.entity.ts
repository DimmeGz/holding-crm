import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Receive } from './receive.entity';

@Entity({ name: 'documents_receiveserviceline' })
export class ReceiveServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Receive, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receive_id' })
  receive: Receive;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;
}
