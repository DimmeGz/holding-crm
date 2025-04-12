import { CreateShipmentLineDTO } from './create-shipment-line.dto';
import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateShipmentLineDTO extends CreateShipmentLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
