import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { ProductTransport } from './product-transport.entity';
import { Service } from '../../../goods/entities';

@Entity({ name: 'documents_producttransportserviceline' })
export class ProductTransportServiceLine extends AbstractEntity {
  @ManyToOne(() => ProductTransport, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'goods_transport_id' })
  productTransport: ProductTransport;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({
    type: 'int',
  })
  qty: number;
}
