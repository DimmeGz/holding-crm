import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';

export class BaseOrderDTO {
  @IsString()
  @Length(1, 15)
  orderNumber: string;

  @IsPositive()
  @IsInt()
  contractId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  signatureDate?: Date;

  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  sellerWarehouseId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  buyerWarehouseId: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientId?: number | null;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientWarehouseId?: number | null;

  @ValidateIf((o) => !o.isDateAsap || o.expectedDate)
  @IsDate()
  @Type(() => Date)
  expectedDate?: Date;

  @ValidateIf((o) => !o.expectedDate || o.isDateAsap)
  @IsBoolean()
  isDateAsap?: boolean;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  vat?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  paymentDelay?: number;

  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  transportPlace?: string;

  @IsOptional()
  @IsString()
  @Length(0, 30)
  carPlate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
