import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { CreateOrderServiceLineDTO } from './create-order-service-line.dto';

export class CreateOrderDTO extends BaseOrderDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDTO)
  orderLines: CreateOrderLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderServiceLineDTO)
  orderServiceLines: CreateOrderServiceLineDTO[];
}
