import { CreateProductionInLineDTO } from './create-production-in-line.dto';
declare const UpdateProductionInLineDTO_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductionInLineDTO>>;
export declare class UpdateProductionInLineDTO extends UpdateProductionInLineDTO_base {
    id: number;
    remove?: boolean;
}
export {};
