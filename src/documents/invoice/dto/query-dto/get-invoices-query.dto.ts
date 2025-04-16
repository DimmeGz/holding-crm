import {
  IsOptional,
  IsString,
  Matches,
  ValidationArguments,
} from 'class-validator';
import { BaseDocumentsQueryDTO } from '../../../common/dto/query-dto';

export class GetInvoicesQueryDTO extends BaseDocumentsQueryDTO {
  @IsOptional()
  @IsString()
  is_ship?: 'true' | 'false';

  @IsOptional()
  @Matches(/^old$|^((202[2-9])|(20[3-9]\d)|([2-9]\d{3}))-(1|2|3|4)$/, {
    message: (args: ValidationArguments) => {
      return `${args.property} must be 'old' or match the pattern YYYY-Q (year >= 2022, Q: 1-4), e.g., 2025-1`;
    },
  })
  date?: string;
}
