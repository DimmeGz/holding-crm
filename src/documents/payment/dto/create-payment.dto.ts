import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';

import { BasePaymentDTO } from './base-payment.dto';
import { CreatePaymentLineDTO } from './create-payment-line.dto';

export class CreatePaymentDTO extends BasePaymentDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePaymentLineDTO)
  paymentLines: CreatePaymentLineDTO[];
}
