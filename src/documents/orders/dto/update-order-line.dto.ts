import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateOrderLineDTO } from './create-order-line.dto';

export class UpdateOrderLineDTO extends PartialType(CreateOrderLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
