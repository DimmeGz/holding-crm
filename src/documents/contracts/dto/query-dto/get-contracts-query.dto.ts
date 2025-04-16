import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { ContractTypeEnum } from '../../enums';
import { Type } from 'class-transformer';

export class GetContractsQueryDTO {
  @ValidateIf((o) => o.type !== undefined)
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  company: number;

  @IsOptional()
  @IsEnum(ContractTypeEnum)
  type?: ContractTypeEnum;
}
