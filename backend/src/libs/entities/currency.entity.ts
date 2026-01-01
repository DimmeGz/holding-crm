import { Column, Entity, OneToMany } from 'typeorm';
import { Account } from '../../companies/entities';
import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'companies_currency' })
export class Currency extends AbstractEntity {
  @Column({ type: 'varchar', length: 3 })
  name: string;

  @OneToMany(() => Account, (account) => account.currency)
  accounts: Account[];
}
