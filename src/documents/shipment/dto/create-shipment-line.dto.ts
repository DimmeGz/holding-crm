import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateShipmentLineDTO {
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
  qty: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  price: number;
}
