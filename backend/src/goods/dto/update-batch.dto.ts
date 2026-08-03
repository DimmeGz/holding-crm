import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class UpdateBatchCustomFieldDTO {
  @IsPositive()
  @IsInt()
  customFieldId: number;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  value?: string | null;
}

export class UpdateBatchDTO {
  @IsOptional()
  @IsPositive()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  name?: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  countryOfOriginId?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBatchCustomFieldDTO)
  customFields?: UpdateBatchCustomFieldDTO[];
}
