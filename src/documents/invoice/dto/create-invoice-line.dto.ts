import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateInvoiceLineDTO {
  @IsPositive()
  @IsInt()
  orderId: number;

  @IsPositive()
  @IsInt()
  productId: number;

  @IsPositive()
  @IsInt()
  batchId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  @IsInt()
  palletsQty: number;

  @IsPositive()
  @IsInt()
  qty: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  price: number;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  cost?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  countryOfOriginId: number;

  @IsOptional()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  grossWeight: number;
}
