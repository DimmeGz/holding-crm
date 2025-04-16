import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseDocumentsQueryDTO } from '../../../common/dto/query-dto';

export class GetContractsQueryDTO extends BaseDocumentsQueryDTO {
  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;
}
