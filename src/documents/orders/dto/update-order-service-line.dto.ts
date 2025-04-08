import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateOrderServiceLineDTO } from './create-order-service-line.dto';

export class UpdateOrderServiceLineDto extends PartialType(
  CreateOrderServiceLineDTO,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
