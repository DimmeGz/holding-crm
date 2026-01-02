import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { IsOneOfDtos } from '../../../common/decorators';
import { BaseReceiveDTO } from './base-receive.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';

import { CreateReceiveLineDTO } from './create-receive-line.dto';
import { UpdateReceiveLineDTO } from './update-receive-line.dto';

export class UpdateReceiveDTO extends BaseReceiveDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateReceiveLineDTO, UpdateReceiveLineDTO)
  receiveLines: (CreateReceiveLineDTO | UpdateReceiveLineDTO)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  receiveServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
