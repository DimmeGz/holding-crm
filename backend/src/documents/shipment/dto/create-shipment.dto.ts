import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseShipmentDTO } from './base-shipment.dto';
import { CreateServiceLineDTO } from '../../common/dto';
import { CreateShipmentLineDTO } from './create-shipment-line.dto';

export class CreateShipmentDTO extends BaseShipmentDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateShipmentLineDTO)
  shipmentLines: CreateShipmentLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  shipmentServiceLines: CreateServiceLineDTO[];
}
