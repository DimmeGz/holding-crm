import {
  Production,
  ProductionInLine,
  ProductionOutLine,
} from '../../../documents/production/entities';

export class ProductionReportResponseDTO {
  company: {
    id: number;
    name: string;
  };
  inProductions: (Production & { productionInLines: ProductionInLine[] })[];
  outProductions: (Production & { productionOutLines: ProductionOutLine[] })[];
}
