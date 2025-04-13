export class CreateTransitLinesDTO {
  shipmentId: number;
  lines: Partial<Line>[];
}

class Line {
  batchId: number;
  packageId: number;
  qty: number;
  [key: string]: any;
}
