import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateCommissionPaymentLineDTO } from './create-commission-payment-line.dto';

export class UpdateCommissionPaymentLineDTO extends PartialType(
  CreateCommissionPaymentLineDTO,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
