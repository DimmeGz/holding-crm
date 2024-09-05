import { Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { Company } from '../../companies/entities';
import { Currency } from '../../libs/entities';

export class AbstractDocumentEntity<T> extends AbstractEntity {
  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'seller_id' })
  seller: Company;

  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Company;

  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  comment: string;

  @Column({
    default: false,
  })
  status: boolean;

  @CreateDateColumn({
    precision: 0,
    type: 'timestamp',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
    name: 'createdAt',
  })
  created_at: Date;

  //created_by

  constructor(entity: Partial<T>) {
    super();
    Object.assign(this, entity);
  }
}
