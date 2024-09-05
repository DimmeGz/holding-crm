import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { AbstractEntity } from '../../../common/entities';
import { Company } from '../../../companies/entities';
import { Warehouse } from '../../../warehouse/entities';
import { TechnicalProcess } from '../../../libs/entities';

@Entity({ name: 'documents_producttransport' })
export class ProductTransport extends AbstractEntity {
  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  company: Company;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'warehouse_sender_id' })
  warehouseSender: Warehouse;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'warehouse_receive_id' })
  warehouseReceive: Warehouse;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  comment: string;

  @CreateDateColumn({
    precision: 0,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdAt',
  })
  created_at: Date;

  //created_by

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

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_producttransport_technical_process',
    joinColumn: {
      name: 'producttransport_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
