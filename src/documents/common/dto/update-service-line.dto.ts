import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';
import { CreateServiceLineDTO } from './create-service-line.dto';

export class UpdateServiceLineDTO extends CreateServiceLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove: boolean;
}
