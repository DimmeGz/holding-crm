import { AbstractServiceLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Shipment } from './shipment.entity';
export declare class ShipmentServiceLine extends AbstractServiceLineEntity {
    shipment: Shipment;
    service: Service;
    serviceId: number;
}
