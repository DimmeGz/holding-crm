import { BaseProductionDTO } from './base-production.dto';
import { CreateProductionInLineDTO } from './create-production-in-line.dto';
import { CreateProductionOutLineDTO } from './create-production-out-line.dto';
export declare class CreateProductionDTO extends BaseProductionDTO {
    productionOutLines: CreateProductionOutLineDTO[];
    productionInLines: CreateProductionInLineDTO[];
}
