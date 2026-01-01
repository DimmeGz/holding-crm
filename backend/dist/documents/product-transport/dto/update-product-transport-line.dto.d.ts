import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';
declare const UpdateProductTransportLineDTO_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductTransportLineDTO>>;
export declare class UpdateProductTransportLineDTO extends UpdateProductTransportLineDTO_base {
    id: number;
    remove?: boolean;
}
export {};
