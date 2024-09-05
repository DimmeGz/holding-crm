import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../../common/entities';
import { Currency } from './currency.entity';

@Entity({ name: 'companies_currencyrate' })
export class CurrencyRate extends AbstractEntity {
  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'base_currency_id' })
  baseCurrency: Currency;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quote_currency_id' })
  quoteCurrency: Currency;

  @Column({
    default: 0,
    type: 'decimal',
    unsigned: true,
    precision: 6,
    scale: 4,
  })
  rate: number;
}
