import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreatePaymentLineDTO } from './create-payment-line.dto';

export class UpdatePaymentLineDTO extends PartialType(CreatePaymentLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
