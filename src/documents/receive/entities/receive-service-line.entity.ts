import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Receive } from './receive.entity';

@Entity({ name: 'documents_receiveserviceline' })
export class ReceiveServiceLine extends AbstractLineEntity {
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
}
