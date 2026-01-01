import { AbstractServiceLineEntity } from '../../entities';
import { ProductTransport } from './product-transport.entity';
import { Service } from '../../../goods/entities';
export declare class ProductTransportServiceLine extends AbstractServiceLineEntity {
    productTransport: ProductTransport;
    service: Service;
    serviceId: number;
}
