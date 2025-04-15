import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { PaymentLine } from '../../payment/entities';
import { Type } from 'class-transformer';

export class UpdatePaymentBalanceDTO {
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => PaymentLine)
  paymentLines: Partial<PaymentLine>[];
}
