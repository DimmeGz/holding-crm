import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CompanyType } from '../enums';
import { AbstractEntity } from '../../common/entities';
import { Account } from './account.entity';
import { Warehouse } from '../../warehouse/entities';

@Entity({ name: 'companies_company' })
export class Company extends AbstractEntity {
  @Column({ name: 'name', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'full_name', type: 'varchar', length: 50, nullable: true })
  fullName: string;

  @Column({
    name: 'name_for_print',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  printName: string;

  @Column({
    name: 'name_for_print_2',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  printName2: string;

  @Column({ name: 'report_type', default: 0, type: 'smallint', unsigned: true })
  reportType: number;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'default_warehouse_id' })
  defaultWarehouse: Warehouse;

  @Column({
    name: 'invoice_prefix',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  invoicePrefix: string;

  @Column({
    name: 'invoice_prefix_alternative',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  invoicePrefixAlternative: string;

  @Column({
    name: 'payment_delay',
    default: 0,
    type: 'smallint',
    unsigned: true,
  })
  paymentDelay: number;

  // users_permission

  @Column({
    name: 'company_type',
    type: 'enum',
    enum: CompanyType,
  })
  companyType: CompanyType;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'smallint',
    unsigned: true,
    nullable: true,
  })
  tin: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  contacts: string;

  @Column({
    name: 'bank_name',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  bankName: string;

  @Column({
    name: 'bank_info',
    type: 'varchar',
    nullable: true,
  })
  bankInfo: string;

  @Column({
    name: 'default_ponz',
    type: 'smallint',
    unsigned: true,
    nullable: true,
  })
  defaultPonz: number;

  @Column({
    name: 'contact_person',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  contactPerson: string;

  @ManyToMany(() => Warehouse)
  @JoinTable({
    name: 'companies_company_warehouses_usage',
    joinColumn: {
      name: 'company_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'warehouse_id',
      referencedColumnName: 'id',
    },
  })
  warehousesUsage: Warehouse[];

  @Column({
    name: 'vat_triangulation_basis',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  vatTriangulationBasis: string;

  @Column({
    name: 'calendar_hex',
    type: 'varchar',
    length: 9,
    nullable: true,
  })
  calendarHex: string;

  // logo_url

  @OneToMany(() => Account, (account) => account.company)
  accounts: Account[];
}
