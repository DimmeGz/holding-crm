import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseProductTransportDTO } from './base-product-transport.dto';
import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';

export class CreateProductTransportDTO extends BaseProductTransportDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductTransportLineDTO)
  productTransportLines: CreateProductTransportLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  productTransportServiceLines: CreateServiceLineDTO[];
}
