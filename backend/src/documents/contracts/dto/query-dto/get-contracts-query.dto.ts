import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ContractQueryTypeEnum {
  BUYER = 'buy',
  SELLER = 'sel',
  INNER = 'inner',
}

export class GetContractsQueryDTO {
  @ValidateIf(
    (o: GetContractsQueryDTO) =>
      o.type !== undefined && o.type !== ContractQueryTypeEnum.INNER,
  )
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  company?: number;

  @IsOptional()
  @IsEnum(ContractQueryTypeEnum)
  type?: ContractQueryTypeEnum;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @Type(() => Number)
  process?: number;
}
