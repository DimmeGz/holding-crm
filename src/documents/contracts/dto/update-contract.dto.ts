import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseContractDTO } from './base-contract-dto';
import { UpdateContractLineDTO } from './update-contract-line.dto';
import { IsOneOfDtos } from '../../../common/decorators';
import { CreateContractLineDTO } from './create-contract-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';

export class UpdateContractDTO extends BaseContractDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateContractLineDTO, UpdateContractLineDTO)
  contractLines: (CreateContractLineDTO | UpdateContractLineDTO)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  contractServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
