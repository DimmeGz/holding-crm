import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateProductionInLineDTO } from './create-production-in-line.dto';

export class UpdateProductionInLineDTO extends PartialType(
  CreateProductionInLineDTO,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
