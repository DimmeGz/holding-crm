import { AbstractServiceLineEntity } from '../../entities';
import { Service } from '../../../goods/entities';
import { Receive } from './receive.entity';
export declare class ReceiveServiceLine extends AbstractServiceLineEntity {
    receive: Receive;
    service: Service;
    serviceId: number;
}
