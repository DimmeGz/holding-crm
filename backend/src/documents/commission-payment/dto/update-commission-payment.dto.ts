import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateCommissionPaymentDTO } from './create-commission-payment.dto';

export class UpdateCommissionPaymentDTO extends PickType(
  PartialType(CreateCommissionPaymentDTO),
  ['expectedDate', 'amount'],
) {}
