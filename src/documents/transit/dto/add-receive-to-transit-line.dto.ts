import { CreateTransitLinesDTO } from './create-transit-line.dto';

export class AddReceiveToTransitLineDTO extends CreateTransitLinesDTO {
  receiveId: number;
}
