import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractEntity } from '../../../common/entities';
import { Company } from '../../../companies/entities';
import { Warehouse } from '../../../warehouse/entities';
import { TechnicalProcess } from '../../../libs/entities';
import { ProductionInLine } from './production-in-line.entity';
import { ProductionOutLine } from './production-out-line.entity';

@Entity({ name: 'documents_production' })
export class Production extends AbstractEntity {
  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @Column({
    default: false,
  })
  status: boolean;

  @CreateDateColumn({
    precision: 0,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt: Date;

  // created_by

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  comment: string;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_production_technical_process',
    joinColumn: {
      name: 'production_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @OneToMany(
    () => ProductionInLine,
    (productionInLine) => productionInLine.production,
    { cascade: true },
  )
  productionInLines: ProductionInLine[];

  @OneToMany(
    () => ProductionOutLine,
    (productionOutLine) => productionOutLine.production,
    { cascade: true },
  )
  productionOutLines: ProductionOutLine[];
}
