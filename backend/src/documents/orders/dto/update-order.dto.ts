import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { IsOneOfDtos } from '../../../common/decorators';

import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { UpdateOrderLineDTO } from './update-order-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';

export class UpdateOrderDTO extends BaseOrderDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateOrderLineDTO, UpdateOrderLineDTO)
  orderLines: (CreateOrderLineDTO | UpdateOrderLineDTO)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  orderServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
