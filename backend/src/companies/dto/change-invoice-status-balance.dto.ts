import { IsBoolean, IsInt, IsNumber, IsPositive } from 'class-validator';

export class ChangeInvoiceStatusBalanceDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsBoolean()
  status: boolean;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsNumber()
  amount: number;
}
