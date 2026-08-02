import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseCommissionPaymentDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDate?: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment?: string;
}
