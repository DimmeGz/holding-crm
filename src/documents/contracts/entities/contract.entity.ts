import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';

@Entity({ name: 'documents_contract' })
export class Contract extends AbstractDocumentEntity<Contract> {
  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_contract_technical_process',
    joinColumn: {
      name: 'contract_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];

  @Column({
    name: 'payment_delay',
    type: 'smallint',
    default: 0,
  })
  paymentDelay: number;

  @Column({
    name: 'signature_date',
    type: 'date',
    default: Date.now(),
  })
  signatureDate: Date;

  @Column({
    type: 'decimal',
    unsigned: true,
    precision: 5,
    scale: 2,
    default: 0,
  })
  vat: number;

  @Column({
    type: 'varchar',
    length: 32,
  })
  name: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  term: Date;

  @ManyToOne(() => Contract, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Contract;

  @Column({ name: 'parent_id' })
  parentId: number;

  @OneToMany(() => Contract, (contract) => contract.parent)
  children: Contract[];

  @ManyToOne(() => Incoterms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'incoterms_id' })
  incoterms: Incoterms;

  @Column({
    name: 'transport_place',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  transportPlace: string;

  @Column({
    name: 'order_prefix',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  orderPrefix: string;

  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;
}
