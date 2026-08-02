import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { DocumentTypeEnum } from '../../../common/enums';
import {
  MAX_VALIDATION_YEAR,
  MIN_VALIDATION_YEAR,
} from '../../../common/constants';
import { transformQueryBoolean } from '../../../../common/transformers';

export class GetOrdersQueryDTO {
  @IsOptional()
  @Transform(transformQueryBoolean)
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @Transform(transformQueryBoolean)
  @IsBoolean()
  hidden?: boolean;

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

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  sellerId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  buyerId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  recipientId?: number;
}
