import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
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
  recipientId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientWarehouseId?: number;

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
  @IsPositive()
  @IsInt()
  vat?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  paymentDelay: number;

  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  transportPlace?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  carPlate?: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment?: string;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
