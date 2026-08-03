import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  Matches,
  ValidationArguments,
} from 'class-validator';

export class TechnoReportQueryDTO {
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process: number;

  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must match the pattern YYYY-MM-DD`;
    },
  })
  startDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must match the pattern YYYY-MM-DD`;
    },
  })
  endDate?: string;
}
