import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { BaseLineDTO } from './base-line.dto';
import { Type } from 'class-transformer';

export class ReceiveTransitLinesDTO {
  @IsPositive()
  @IsInt()
  receiveId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseLineDTO)
  lines: Partial<BaseLineDTO>[];
}
