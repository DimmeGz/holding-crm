import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AbstractDocumentEntity } from '../../entities';
import { TechnicalProcess } from '../../../libs/entities';

@Entity({ name: 'documents_payment' })
export class Payment extends AbstractDocumentEntity<Payment> {
  @Column({
    name: 'document_sum',
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 3,
    default: 0,
  })
  documentSum: number;

  @Column({
    name: 'expected_date',
    type: 'date',
    nullable: true,
  })
  expectedDate: Date;

  @ManyToMany(() => TechnicalProcess)
  @JoinTable({
    name: 'documents_payment_technical_process',
    joinColumn: {
      name: 'payment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technical_process_id',
      referencedColumnName: 'id',
    },
  })
  technicalProcesses: TechnicalProcess[];
}
