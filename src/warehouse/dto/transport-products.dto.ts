export class TransportProductsDTO {
  companyId: number;
  warehouseSenderId: number;
  warehouseReceiveId: number;
  transportLines: TransportLine[];
}

class TransportLine {
  batchId: number;
  packageId: number;
  qty: number;
}
