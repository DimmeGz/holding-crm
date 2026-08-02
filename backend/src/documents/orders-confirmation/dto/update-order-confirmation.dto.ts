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
} from 'class-validator';

import { IsOneOfDtos } from '../../../common/decorators';

import { CreateOrderConfirmationLineDTO } from './create-order-confirmation-line.dto';
import { UpdateOrderConfirmationLineDTO } from './update-order-confirmation-line.dto';

export class UpdateOrderConfirmationDTO {
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
  @Type(() => Object)
  @IsOneOfDtos(CreateOrderConfirmationLineDTO, UpdateOrderConfirmationLineDTO)
  orderLines: (CreateOrderConfirmationLineDTO | UpdateOrderConfirmationLineDTO)[];
}
