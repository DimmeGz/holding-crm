import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Warehouse } from '../../../warehouse/entities';
import { Invoice } from '../../invoice/entities';

@Entity({ name: 'documents_receive' })
export class Receive extends AbstractDocumentEntity<Receive> {
  @ManyToOne(() => Incoterms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'incoterms_id' })
  incoterms: Incoterms;

  @Column({
    name: 'transport_place',
    type: 'varchar',
    length: 20,
  })
  transportPlace: string;

  @Column({
    name: 'transport_amount',
    type: 'decimal',
    unsigned: true,
    precision: 8,
    scale: 2,
    default: 0,
  })
  transportAmount: number;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_warehouse_id' })
  buyerWarehouse: Warehouse;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @Column({
    name: 'document_sum',
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 3,
    default: 0,
  })
  documentSum: number;

  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_receive_technical_process',
    joinColumn: {
      name: 'receive_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
