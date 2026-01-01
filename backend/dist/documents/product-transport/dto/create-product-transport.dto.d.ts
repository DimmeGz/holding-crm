import { BaseProductTransportDTO } from './base-product-transport.dto';
import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';
export declare class CreateProductTransportDTO extends BaseProductTransportDTO {
    productTransportLines: CreateProductTransportLineDTO[];
    productTransportServiceLines: CreateServiceLineDTO[];
}
