import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseContractDTO } from './base-contract-dto';
import { UpdateContractLineDto } from './update-contract-line.dto';
import { UpdateContractServiceLineDto } from './update-contract-service-line.dto';
import { IsOneOfDtos } from '../../../common/decorators';
import { CreateContractServiceLineDto } from './create-contract-service-line.dto';
import { CreateContractLineDto } from './create-contract-line.dto';

export class UpdateContractDTO extends BaseContractDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateContractLineDto, UpdateContractLineDto)
  contractLines: (CreateContractLineDto | UpdateContractLineDto)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateContractServiceLineDto, UpdateContractServiceLineDto)
  contractServiceLines: (
    | CreateContractServiceLineDto
    | UpdateContractServiceLineDto
  )[];
}
