import { IsBoolean, IsInt, IsNumber, IsPositive } from 'class-validator';

export class MakePaymentDTO {
  @IsBoolean()
  status: boolean;

  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsNumber()
  amount: number;
}
