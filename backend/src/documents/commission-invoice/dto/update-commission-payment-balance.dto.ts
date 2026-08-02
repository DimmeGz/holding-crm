import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';

import { CommissionPaymentLine } from '../../commission-payment/entities';

export class UpdateCommissionPaymentBalanceDTO {
  @IsBoolean()
  status: boolean;

  @IsOptional()
  @IsArray()
  @Type(() => CommissionPaymentLine)
  commissionPaymentLines: Partial<CommissionPaymentLine>[];
}
