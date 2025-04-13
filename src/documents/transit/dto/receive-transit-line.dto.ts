import { BaseLineDTO } from './base-line.dto';

export class ReceiveTransitLinesDTO {
  receiveId: number;
  lines: Partial<BaseLineDTO>[];
}
