import { PartialType } from '@nestjs/mapped-types';

import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateReceiveLineDTO } from './create-receive-line.dto';

export class UpdateReceiveLineDTO extends PartialType(CreateReceiveLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
