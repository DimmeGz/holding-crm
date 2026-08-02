import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { BaseCommissionPaymentDTO } from './base-commission-payment.dto';
import { CreateCommissionPaymentLineDTO } from './create-commission-payment-line.dto';

export class CreateCommissionPaymentDTO extends BaseCommissionPaymentDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCommissionPaymentLineDTO)
  commissionPaymentLines: CreateCommissionPaymentLineDTO[];
}
