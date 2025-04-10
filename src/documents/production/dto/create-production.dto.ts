import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { BaseProductionDTO } from './base-production.dto';

import { CreateProductionInLineDTO } from './create-production-in-line.dto';
import { CreateProductionOutLineDTO } from './create-production-out-line.dto';
import { Type } from 'class-transformer';

export class CreateProductionDTO extends BaseProductionDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductionOutLineDTO)
  productionOutLines: CreateProductionOutLineDTO[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductionInLineDTO)
  productionInLines: CreateProductionInLineDTO[];
}
