import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class CreateCommissionInvoiceDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  invoiceId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  creationDate?: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  rate: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
