import { IsNumber, IsPositive } from 'class-validator';
import { CreateProductionInLineDTO } from './create-production-in-line.dto';

export class CreateProductionOutLineDTO extends CreateProductionInLineDTO {
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  cost: number;
}
