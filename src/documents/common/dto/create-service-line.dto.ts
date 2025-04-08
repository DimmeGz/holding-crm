import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateServiceLineDTO {
  @IsPositive()
  @IsInt()
  serviceId: number;

  @IsPositive()
  @IsInt()
  qty: number;

  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 3 })
  price: number;
}
