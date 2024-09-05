import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Service } from '../../../goods/entities';

@Entity({ name: 'documents_orderserviceline' })
export class OrderServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Order, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}
