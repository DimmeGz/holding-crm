import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

import { DocumentTypeEnum } from '../../../common/enums';
import {
  MAX_VALIDATION_YEAR,
  MIN_VALIDATION_YEAR,
} from '../../../common/constants';

export class GetOrdersQueryDTO {
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsInt()
  @Min(MIN_VALIDATION_YEAR)
  @Max(MAX_VALIDATION_YEAR)
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsEnum(DocumentTypeEnum)
  type?: DocumentTypeEnum;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;
}
