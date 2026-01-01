import { AbstractServiceLineEntity } from '../../entities';
import { Order } from './order.entity';
import { Service } from '../../../goods/entities';
export declare class OrderServiceLine extends AbstractServiceLineEntity {
    order: Order;
    service: Service;
    serviceId: number;
}
