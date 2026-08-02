import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateReceiveLineDTO {
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

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  price: number;
}
