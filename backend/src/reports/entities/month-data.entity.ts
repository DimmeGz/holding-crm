import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { DecimalColumnTransformer } from '../../common/transformers';
import { AbstractEntity } from '../../common/entities';
import { Company } from '../../companies/entities';

@Entity({ name: 'reports_monthdata' })
@Unique('UQ_reports_monthdata_company_month', ['companyId', 'month'])
export class MonthData extends AbstractEntity {
  @ManyToOne(() => Company, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'company_id' })
  companyId: number;

  @Column({ type: 'date' })
  month: string;

  @Column({ name: 'in_qty', type: 'int', default: 0 })
  inQty: number;

  @Column({
    name: 'in_sum',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  inSum: number;

  @Column({
    name: 'in_vat',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  inVat: number;

  @Column({
    name: 'in_transport',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  inTransport: number;

  @Column({
    name: 'in_pay',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  inPay: number;

  @Column({ name: 'out_qty', type: 'int', default: 0 })
  outQty: number;

  @Column({
    name: 'out_sum',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  outSum: number;

  @Column({
    name: 'out_vat',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  outVat: number;

  @Column({
    name: 'out_transport',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  outTransport: number;

  @Column({
    name: 'out_pay',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  outPay: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  commission: number;

  @Column({
    name: 'commission_pay',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  commissionPay: number;

  @Column({
    name: 'commission_left',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  commissionLeft: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  delta: number;

  @Column({
    name: 'operating_outgoings',
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  operatingOutgoings: number;

  @Column({
    name: 'fact_vat_return',
    type: 'decimal',
    precision: 12,
    scale: 3,
    nullable: true,
    transformer: new DecimalColumnTransformer(),
  })
  factVatReturn: number | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  cashflow: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 3,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  warehouse: number;
}
