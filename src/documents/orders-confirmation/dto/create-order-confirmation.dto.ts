import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderConfirmationDTO {
  @IsPositive()
  @IsInt()
  orderId: number;

  @IsPositive()
  @IsInt()
  sellerId: number;

  @IsPositive()
  @IsInt()
  buyerId: number;

  @IsPositive()
  @IsInt()
  currencyId: number;

  @IsPositive()
  @IsInt()
  sellerWarehouseId: number;

  @IsPositive()
  @IsInt()
  buyerWarehouseId: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientId: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientWarehouseId: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  paymentDelay: number;

  @IsString()
  @IsNotEmpty()
  confirmationNumber: string;

  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

  @IsPositive()
  @IsInt()
  incotermsId: number;

  @IsString()
  @IsNotEmpty()
  transportPlace: string;

  @IsOptional()
  @IsString()
  comment?: string;
}
