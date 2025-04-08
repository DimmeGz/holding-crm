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

  @Column({ name: 'seller_id' })
  sellerId: number;

  @ManyToOne(() => Company, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: Company;

  @Column({ name: 'buyer_id' })
  buyerId: number;

  @ManyToOne(() => Currency, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({ name: 'currency_id' })
  currencyId: number;

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
    default: () => 'CURRENT_TIMESTAMP(6)',
    name: 'created_at',
  })
  createdAt: Date;

  // TODO: created_by
  @Column({ name: 'created_by_id' })
  createdById: number;

  constructor(entity: Partial<T>) {
    super();
    // TODO: created_by
    Object.assign(this, { ...entity, createdById: 1 });
  }
}
