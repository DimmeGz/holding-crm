import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';

import { BaseProductionDTO } from './base-production.dto';
import { IsOneOfDtos } from '../../../common/decorators';

import { CreateProductionOutLineDTO } from './create-production-out-line.dto';
import { UpdateProductionOutLineDTO } from './update-production-out-line.dto';
import { CreateProductionInLineDTO } from './create-production-in-line.dto';
import { UpdateProductionInLineDTO } from './update-production-in-line.dto';

export class UpdateProductionDTO extends PartialType(BaseProductionDTO) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateProductionOutLineDTO, UpdateProductionOutLineDTO)
  productionOutLines: (
    | CreateProductionOutLineDTO
    | UpdateProductionOutLineDTO
  )[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateProductionInLineDTO, UpdateProductionInLineDTO)
  productionInLines: (CreateProductionInLineDTO | UpdateProductionInLineDTO)[];
}
