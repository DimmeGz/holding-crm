import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  Matches,
  Min,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';

export class UpdateMonthDataDTO {
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must match the pattern YYYY-MM`;
    },
  })
  month: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0)
  @Type(() => Number)
  operatingOutgoings: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === undefined ? null : value))
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  factVatReturn?: number | null;
}
