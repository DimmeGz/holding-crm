import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

import { BaseOrderDTO } from './base-order.dto';
import { CreateOrderLineDTO } from './create-order-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';

export class CreateOrderDTO extends OmitType(BaseOrderDTO, [
  'orderNumber',
] as const) {
  @IsOptional()
  @IsString()
  @Length(1, 15)
  orderNumber?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDTO)
  orderLines: CreateOrderLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  orderServiceLines: CreateServiceLineDTO[];
}
