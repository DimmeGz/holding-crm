import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Batch, Package } from '../../goods/entities';
import { Warehouse } from './warehouse.entity';
import { Company } from '../../companies/entities';
import { Currency } from '../../libs/entities';
import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'warehouse_warehouseaccounting' })
export class WarehouseAccounting extends AbstractEntity {
  @ManyToOne(() => Batch, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Package, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @ManyToOne(() => Warehouse, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

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
  })
  cost: number;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;
}
