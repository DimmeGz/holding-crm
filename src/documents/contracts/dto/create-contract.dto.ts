import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateContractLineDto } from './create-contract-line.dto';
import { CreateContractServiceLineDto } from './create-contract-service-line.dto';
import { BaseContractDTO } from './base-contract-dto';

export class CreateContractDTO extends BaseContractDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContractLineDto)
  contractLines: CreateContractLineDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateContractServiceLineDto)
  contractServiceLines: CreateContractServiceLineDto[];
}
