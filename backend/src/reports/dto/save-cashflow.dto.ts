import { Type } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

export class SaveCashflowDTO {
  @IsInt()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  year: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  amount: number;
}
