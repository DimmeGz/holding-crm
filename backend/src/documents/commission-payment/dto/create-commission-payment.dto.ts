import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateCommissionPaymentDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  commissionInvoiceId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDate?: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}
