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

export class BaseShipmentDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  sellerWarehouseId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsPositive()
  @IsInt()
  invoiceId: number;

  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(0, 20)
  transportPlace?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  transportAmount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
