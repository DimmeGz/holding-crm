import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { DecimalColumnTransformer } from '../../common/transformers';

import { AbstractEntity } from '../../common/entities';
import { Batch, Package } from '../../goods/entities';
import { Company } from '../../companies/entities';
import { Currency } from '../../libs/entities';
import { Warehouse } from './warehouse.entity';

@Entity({ name: 'warehouse_warehouseaccounting' })
export class WarehouseAccounting extends AbstractEntity {
  @ManyToOne(() => Batch, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batchId: number;

  @ManyToOne(() => Package, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @Column({ name: 'package_id' })
  packageId: number;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'warehouse_id' })
  warehouseId: number;

  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({
    type: 'int',
  })
  qty: number;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  cost: number;

  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'currency_id' })
  currencyId: number;

  constructor(entity: Partial<WarehouseAccounting>) {
    super();
    Object.assign(this, entity);
  }
}
