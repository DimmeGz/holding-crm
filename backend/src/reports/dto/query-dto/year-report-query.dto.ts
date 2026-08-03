import { IsOptional, Matches, ValidationArguments } from 'class-validator';

export class YearReportQueryDTO {
  @IsOptional()
  @Matches(/^\d{4}$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must match the pattern YYYY`;
    },
  })
  date?: string;
}
