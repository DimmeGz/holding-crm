import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractLineEntity } from '../../entities';
import { Contract } from './contract.entity';
import { Product } from '../../../goods/entities';

@Entity({ name: 'documents_contractline' })
export class ContractLine extends AbstractLineEntity {
  @ManyToOne(() => Contract, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'ship_qty', type: 'smallint', unsigned: true, default: 1 })
  shipQty: number;
}
