import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../../common/entities';

@Entity({ name: 'warehouse_countryoforigin' })
export class CountryOfOrigin extends AbstractEntity {
  @Column({ type: 'varchar', length: 16 })
  name: string;
}
