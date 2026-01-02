import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreatePaymentLineDTO {
  @IsPositive()
  @IsInt()
  invoiceId: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  amount: number;
}
