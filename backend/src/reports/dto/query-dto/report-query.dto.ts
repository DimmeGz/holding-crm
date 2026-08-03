import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Matches,
  ValidationArguments,
} from 'class-validator';

export class ReportQueryDTO {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;

  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must match the pattern YYYY-MM`;
    },
  })
  date?: string;
}
