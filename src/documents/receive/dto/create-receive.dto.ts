import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseReceiveDTO } from './base-receive.dto';
import { CreateServiceLineDTO } from '../../common/dto';
import { CreateReceiveLineDTO } from './create-receive-line.dto';

export class CreateReveiveDTO extends BaseReceiveDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateReceiveLineDTO)
  receiveLines: CreateReceiveLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  receiveServiceLines: CreateServiceLineDTO[];
}
