import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateProductionOutLineDTO } from './create-production-out-line.dto';

export class UpdateProductionOutLineDTO extends PartialType(
  CreateProductionOutLineDTO,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
