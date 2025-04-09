import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { Product, Service } from '../../goods/entities';
import { Invoice } from '../../documents/invoice/entities';

@Entity({ name: 'warehouse_technicalprocess' })
export class TechnicalProcess extends AbstractEntity {
  @Column({
    type: 'varchar',
    length: 40,
    unique: true,
  })
  name: string;

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'warehouse_technicalprocess_product',
    joinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @ManyToMany(() => Service)
  @JoinTable({
    name: 'warehouse_technicalprocess_service',
    joinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
  })
  services: Service[];

  @ManyToMany(() => Invoice)
  @JoinTable({
    name: 'documents_invoice_technical_process',
    joinColumn: {
      name: 'technicalprocess_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'invoice_id',
      referencedColumnName: 'id',
    },
  })
  invoices: Invoice[];

  //   users_permission
}
