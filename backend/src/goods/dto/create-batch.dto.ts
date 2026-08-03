import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateBatchDTO {
  @IsPositive()
  @IsInt()
  productId: number;

  @IsString()
  @Length(1, 16)
  name: string;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  countryOfOriginId?: number | null;
}
