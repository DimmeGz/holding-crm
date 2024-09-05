import { Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Shipment } from './shipment.entity';

@Entity({ name: 'documents_shipmentserviceline' })
export class ShipmentServiceLine extends AbstractLineEntity {
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
}
