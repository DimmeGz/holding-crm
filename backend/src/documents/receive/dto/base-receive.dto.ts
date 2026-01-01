import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseReceiveDTO {
  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  buyerWarehouseId: number;

  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsPositive()
  @IsInt()
  shipmentId: number;

  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  transportPlace?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  transportAmount?: number;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
