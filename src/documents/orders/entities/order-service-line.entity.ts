import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Service } from '../../../goods/entities';

@Entity({ name: 'documents_orderserviceline' })
export class OrderServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Order, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;
}
