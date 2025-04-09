import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractServiceLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Shipment } from './shipment.entity';

@Entity({ name: 'documents_shipmentserviceline' })
export class ShipmentServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Shipment, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shipment_id' })
  shipment: Shipment;

  @ManyToOne(() => Service, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;
}
