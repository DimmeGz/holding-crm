import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractServiceLineEntity } from '../../entities';
import { Contract } from './contract.entity';
import { Product, Service } from '../../../goods/entities';

@Entity({ name: 'documents_contractserviceline' })
export class ContractServiceLine extends AbstractServiceLineEntity {
  @ManyToOne(() => Contract, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;

  @ManyToOne(() => Product, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column({ name: 'service_id' })
  serviceId: number;

  @Column({ type: 'smallint', unsigned: true, default: 1 })
  qty: number;
}
