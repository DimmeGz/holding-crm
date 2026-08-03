export type ReportShipmentReceive = {
  id: number;
  status: boolean;
};

export type ReportShipment = {
  id: number;
  status: boolean;
  receives: ReportShipmentReceive[];
};
