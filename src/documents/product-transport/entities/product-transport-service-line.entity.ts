import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';

import { ProductTransport } from './product-transport.entity';
import { Service } from '../../../goods/entities';

@Entity({ name: 'documents_producttransportserviceline' })
export class ProductTransportServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => ProductTransport, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goods_transport_id' })
  productTransport: ProductTransport;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;
}
