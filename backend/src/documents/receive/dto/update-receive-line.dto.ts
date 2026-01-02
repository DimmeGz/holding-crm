import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateReceiveLineDTO } from './create-receive-line.dto';

export class UpdateReceiveLineDTO extends CreateReceiveLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
