import { Column, Entity } from 'typeorm';

import { ProductionInLine } from './production-in-line.entity';

@Entity({ name: 'documents_productionoutline' })
export class ProductionOutLine extends ProductionInLine {
  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
    default: 0,
  })
  cost: number;
}
