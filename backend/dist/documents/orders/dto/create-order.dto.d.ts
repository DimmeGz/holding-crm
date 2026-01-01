import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';
export declare class CreateOrderDTO extends BaseOrderDTO {
    orderLines: CreateOrderLineDTO[];
    orderServiceLines: CreateServiceLineDTO[];
}
