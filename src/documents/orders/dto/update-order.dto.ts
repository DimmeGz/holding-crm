import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { IsOneOfDtos } from '../../../common/decorators';

import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { UpdateOrderLineDto } from './update-order-line.dto';
import { CreateOrderServiceLineDTO } from './create-order-service-line.dto';
import { UpdateOrderServiceLineDto } from './update-order-service-line.dto';

export class UpdateOrderDTO extends BaseOrderDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateOrderLineDTO, UpdateOrderLineDto)
  orderLines: (CreateOrderLineDTO | UpdateOrderLineDto)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateOrderServiceLineDTO, UpdateOrderServiceLineDto)
  orderServiceLines: (CreateOrderServiceLineDTO | UpdateOrderServiceLineDto)[];
}
