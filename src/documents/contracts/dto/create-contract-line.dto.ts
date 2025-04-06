import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateContractLineDto {
  @IsPositive()
  @IsInt()
  productId: number;

  @IsPositive()
  @IsInt()
  packageId: number;

  @IsPositive()
  @IsInt()
  shipQty: number;

  @IsPositive()
  @IsInt()
  qty: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  price: number;
}
