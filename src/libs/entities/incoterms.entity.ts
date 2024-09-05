import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { PayerType } from '../enums';

@Entity({ name: 'documents_incoterms' })
export class Incoterms extends AbstractEntity {
  @Column({ type: 'varchar', length: 3 })
  name: string;

  @Column({
    name: 'payer',
    type: 'enum',
    enum: PayerType,
  })
  payerType: PayerType;
}
