import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { IsOneOfDtos } from '../../../common/decorators';

import { PartialType } from '@nestjs/mapped-types';
import { BaseShipmentDTO } from './base-shipment.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { CreateShipmentLineDTO } from './create-shipment-line.dto';
import { UpdateShipmentLineDTO } from './update-shipment-line.dto';

export class UpdateShipmentDTO extends BaseShipmentDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateShipmentLineDTO, UpdateShipmentLineDTO)
  shipmentLines: (CreateShipmentLineDTO | UpdateShipmentLineDTO)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  shipmentServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
