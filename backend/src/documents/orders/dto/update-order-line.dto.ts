import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateOrderLineDTO } from './create-order-line.dto';

export class UpdateOrderLineDTO extends CreateOrderLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
