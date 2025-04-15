import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { BaseLineDTO } from './base-line.dto';
import { Type } from 'class-transformer';

export class CreateTransitLinesDTO {
  @IsPositive()
  @IsInt()
  shipmentId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseLineDTO)
  lines: Partial<BaseLineDTO>[];
}
