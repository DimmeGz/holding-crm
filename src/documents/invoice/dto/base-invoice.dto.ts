import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseInvoiceDTO {
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

  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

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
  paymentDelay?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  invoiceId?: number;

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
  carPlate: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  ponz?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  grossWeight?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  transportAmount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  contractInfo?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  reportPeriod?: Date;

  @IsOptional()
  @IsBoolean()
  separation?: boolean;

  @IsString()
  @Length(0, 15)
  invoiceNumber: string;

  @IsBoolean()
  reportDuplicating: boolean;
}
