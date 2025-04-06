import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateContractServiceLineDto {
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
