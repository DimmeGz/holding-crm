import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { DecimalColumnTransformer } from '../../../common/transformers';

import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Warehouse } from '../../../warehouse/entities';
import { Invoice } from '../../invoices/entities';
import { ShipmentLine } from './shipment-line.entity';
import { ShipmentServiceLine } from './shipment-service-line.entity';
import { Receive } from '../../receive/entities';

@Entity({ name: 'documents_shipment' })
export class Shipment extends AbstractDocumentEntity<Shipment> {
  @ManyToOne(() => Incoterms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'incoterms_id' })
  incoterms: Incoterms;

  @Column({ name: 'incoterms_id' })
  incotermsId: number;

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
    transformer: new DecimalColumnTransformer(),
  })
  transportAmount: number;

  @ManyToOne(() => Warehouse, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'seller_warehouse_id' })
  sellerWarehouse: Warehouse;

  @Column({ name: 'seller_warehouse_id' })
  sellerWarehouseId: number;

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
    transformer: new DecimalColumnTransformer(),
  })
  documentSum: number;

  @ManyToOne(() => Invoice, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @Column({ name: 'invoice_id' })
  invoiceId: number;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_shipment_technical_process',
    joinColumn: {
      name: 'shipment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: Partial<TechnicalProcess>[];

  @OneToMany(() => ShipmentLine, (shipmentLine) => shipmentLine.shipment, {
    cascade: true,
  })
  shipmentLines: Partial<ShipmentLine>[];

  @OneToMany(
    () => ShipmentServiceLine,
    (shipmentServiceLine) => shipmentServiceLine.shipment,
    {
      cascade: true,
    },
  )
  shipmentServiceLines: Partial<ShipmentServiceLine>[];

  @OneToMany(() => Receive, (receive) => receive.shipment)
  receives: Receive[];
}
