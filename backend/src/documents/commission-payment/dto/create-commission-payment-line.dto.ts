import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateCommissionPaymentLineDTO {
  @IsPositive()
  @IsInt()
  commissionInvoiceId: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  amount: number;
}
