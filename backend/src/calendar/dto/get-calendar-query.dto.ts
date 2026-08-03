import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

import {
  MAX_VALIDATION_YEAR,
  MIN_VALIDATION_YEAR,
} from '../../documents/common/constants';
import { DocumentTypeEnum } from '../../documents/common/enums';

function transformProcessQuery({
  value,
}: {
  value: unknown;
}): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const values = Array.isArray(value) ? value : [value];
  return values.map((item) => Number(item));
}

export class GetCalendarQueryDTO {
  @IsOptional()
  @IsInt()
  @Min(MIN_VALIDATION_YEAR)
  @Max(MAX_VALIDATION_YEAR)
  @Type(() => Number)
  year?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  month?: number;

  @IsOptional()
  @Transform(transformProcessQuery)
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  process?: number[];

  @IsOptional()
  @IsEnum(DocumentTypeEnum)
  type?: DocumentTypeEnum;
}
