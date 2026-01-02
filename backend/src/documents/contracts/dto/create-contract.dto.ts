import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateContractLineDTO } from './create-contract-line.dto';
import { BaseContractDTO } from './base-contract-dto';
import { CreateServiceLineDTO } from '../../common/dto';

export class CreateContractDTO extends BaseContractDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateContractLineDTO)
  contractLines: CreateContractLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  contractServiceLines: CreateServiceLineDTO[];
}
