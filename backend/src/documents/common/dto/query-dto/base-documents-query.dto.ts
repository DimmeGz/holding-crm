import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DocumentTypeEnum } from '../../../common/enums';

export class BaseDocumentsQueryDTO {
  @ValidateIf((o) => o.type !== undefined)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  company: number;

  @IsOptional()
  @IsEnum(DocumentTypeEnum)
  type?: DocumentTypeEnum;
}
