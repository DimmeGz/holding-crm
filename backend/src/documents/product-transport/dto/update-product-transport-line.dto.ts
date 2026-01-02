import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateProductTransportLineDTO } from './create-product-transport-line.dto';

export class UpdateProductTransportLineDTO extends PartialType(
  CreateProductTransportLineDTO,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
