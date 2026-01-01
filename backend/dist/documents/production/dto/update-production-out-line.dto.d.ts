import { CreateProductionOutLineDTO } from './create-production-out-line.dto';
declare const UpdateProductionOutLineDTO_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductionOutLineDTO>>;
export declare class UpdateProductionOutLineDTO extends UpdateProductionOutLineDTO_base {
    id: number;
    remove?: boolean;
}
export {};
