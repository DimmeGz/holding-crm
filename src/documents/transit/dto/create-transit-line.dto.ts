import { BaseLineDTO } from './base-line.dto';

export class CreateTransitLinesDTO {
  shipmentId: number;
  lines: Partial<BaseLineDTO>[];
}
