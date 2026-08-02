import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class BaseContractDTO {
  @IsString()
  @Length(1, 32)
  name: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  parentId?: number;

  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  signatureDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  term?: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vat: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  paymentDelay: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  transportPlace: string;

  @IsOptional()
  @IsString()
  @Length(0, 6)
  orderPrefix: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
