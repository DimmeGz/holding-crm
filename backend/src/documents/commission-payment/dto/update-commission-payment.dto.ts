import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';

import { IsOneOfDtos } from '../../../common/decorators';

import { BaseCommissionPaymentDTO } from './base-commission-payment.dto';
import { CreateCommissionPaymentLineDTO } from './create-commission-payment-line.dto';
import { UpdateCommissionPaymentLineDTO } from './update-commission-payment-line.dto';

export class UpdateCommissionPaymentDTO extends PartialType(
  BaseCommissionPaymentDTO,
) {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateCommissionPaymentLineDTO, UpdateCommissionPaymentLineDTO)
  commissionPaymentLines: (
    | CreateCommissionPaymentLineDTO
    | UpdateCommissionPaymentLineDTO
  )[];
}
