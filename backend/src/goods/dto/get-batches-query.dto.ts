import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetBatchesQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  process?: number;
}
