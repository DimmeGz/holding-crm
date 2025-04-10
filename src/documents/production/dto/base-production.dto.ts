import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

export class BaseProductionDTO {
  @IsPositive()
  @IsInt()
  companyId: number;

  @IsPositive()
  @IsInt()
  warehouseId: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDate: Date;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  comment: string;
}
