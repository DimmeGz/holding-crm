import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';

import { IsOneOfDtos } from '../../../common/decorators';

import { BasePaymentDTO } from './base-payment.dto';

import { CreatePaymentLineDTO } from './create-payment-line.dto';
import { UpdatePaymentLineDTO } from './update-payment-line.dto';

export class UpdatePaymentDTO extends PartialType(BasePaymentDTO) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreatePaymentLineDTO, UpdatePaymentLineDTO)
  paymentLines: (CreatePaymentLineDTO | UpdatePaymentLineDTO)[];
}
