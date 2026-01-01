import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { BaseProductTransportDTO } from './base-product-transport.dto';
import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';
import { UpdateProductTransportLineDTO } from './update-product-transport-line.dto';
declare const UpdateProductTransportDTO_base: import("@nestjs/mapped-types").MappedType<Partial<BaseProductTransportDTO>>;
export declare class UpdateProductTransportDTO extends UpdateProductTransportDTO_base {
    productTransportLines: (CreateProductTransportLineDTO | UpdateProductTransportLineDTO)[];
    productTransportServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
export {};
