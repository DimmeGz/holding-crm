import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderConfirmationLineDTO {
  @IsPositive()
  @IsInt()
  productManId: number;

  @IsPositive()
  @IsInt()
  productBuyId: number;

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
