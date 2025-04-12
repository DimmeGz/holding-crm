import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateContractLineDTO } from './create-contract-line.dto';

export class UpdateContractLineDTO extends CreateContractLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
