import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateContractServiceLineDto } from './create-contract-service-line.dto';

export class UpdateContractServiceLineDto extends PartialType(
  CreateContractServiceLineDto,
) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
