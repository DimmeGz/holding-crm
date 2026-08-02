import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';

import { CreateOrderConfirmationLineDTO } from './create-order-confirmation-line.dto';

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
  recipientId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  recipientWarehouseId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  paymentDelay?: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 15)
  @Matches(/\d+$/, {
    message: 'Confirmation number must end with digits',
  })
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

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderConfirmationLineDTO)
  orderLines: CreateOrderConfirmationLineDTO[];
}
