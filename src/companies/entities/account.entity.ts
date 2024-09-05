import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { Currency } from '../../libs/entities';
import { Company } from './company.entity';

@Entity({ name: 'companies_account' })
export class Account extends AbstractEntity {
  @ManyToOne(() => Company, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  company: Company;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @Column({
    default: 0,
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 2,
  })
  balance: number;

  @Column({
    default: 0,
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 2,
  })
  wait: number;

  @Column({
    default: 0,
    type: 'decimal',
    unsigned: true,
    precision: 13,
    scale: 2,
  })
  debt: number;
}
