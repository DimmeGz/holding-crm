import { BaseProductionDTO } from './base-production.dto';
import { CreateProductionOutLineDTO } from './create-production-out-line.dto';
import { UpdateProductionOutLineDTO } from './update-production-out-line.dto';
import { CreateProductionInLineDTO } from './create-production-in-line.dto';
import { UpdateProductionInLineDTO } from './update-production-in-line.dto';
declare const UpdateProductionDTO_base: import("@nestjs/mapped-types").MappedType<Partial<BaseProductionDTO>>;
export declare class UpdateProductionDTO extends UpdateProductionDTO_base {
    productionOutLines: (CreateProductionOutLineDTO | UpdateProductionOutLineDTO)[];
    productionInLines: (CreateProductionInLineDTO | UpdateProductionInLineDTO)[];
}
export {};
