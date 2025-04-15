import { IsInt, IsPositive } from 'class-validator';
import { CreateTransitLinesDTO } from './create-transit-line.dto';

export class AddReceiveToTransitLineDTO extends CreateTransitLinesDTO {
  @IsPositive()
  @IsInt()
  receiveId: number;
}
