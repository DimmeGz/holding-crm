import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateServiceLineDTO } from './create-service-line.dto';

export class UpdateServiceLineDTO extends PartialType(CreateServiceLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
