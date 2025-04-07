import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateContractDTO } from './create-contract.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateContractLineDto extends PartialType(CreateContractDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
