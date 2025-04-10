import { PartialType } from '@nestjs/mapped-types';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { IsOneOfDtos } from '../../../common/decorators';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';

import { BaseProductTransportDTO } from './base-product-transport.dto';
import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';
import { UpdateProductTransportLineDTO } from './update-product-transport-line.dto';

export class UpdateProductTransportDTO extends PartialType(
  BaseProductTransportDTO,
) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateProductTransportLineDTO, UpdateProductTransportLineDTO)
  productTransportLines: (
    | CreateProductTransportLineDTO
    | UpdateProductTransportLineDTO
  )[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  productTransportServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
