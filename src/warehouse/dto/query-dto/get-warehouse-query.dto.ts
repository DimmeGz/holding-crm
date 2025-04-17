import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class GetWarehouseQueryDTO {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  company?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  warehouse?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;
}
