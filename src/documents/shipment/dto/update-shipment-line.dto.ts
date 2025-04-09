import { PartialType } from '@nestjs/mapped-types';
import { CreateShipmentLineDTO } from './create-shipment-line.dto';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateShipmentLineDTO extends PartialType(CreateShipmentLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
