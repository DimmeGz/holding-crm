import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { UpdateOrderLineDTO } from './update-order-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
export declare class UpdateOrderDTO extends BaseOrderDTO {
    orderLines: (CreateOrderLineDTO | UpdateOrderLineDTO)[];
    orderServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
