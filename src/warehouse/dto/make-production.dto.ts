import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { ProductLine } from './product-line.dto';
import { Type } from 'class-transformer';

export class MakeProductionDTO {
  @IsBoolean()
  status: boolean;

  @IsPositive()
  @IsInt()
  companyId: number;

  @IsPositive()
  @IsInt()
  warehouseId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductLine)
  outLines: ProductLine[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductLine)
  inLines: ProductLine[];
}
