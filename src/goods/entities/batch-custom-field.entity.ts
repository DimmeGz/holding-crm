import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { Batch } from './batch.entity';
import { CustomField } from './custom-field.entity';

@Entity({ name: 'warehouse_batchescustomfields' })
export class BatchCustomField extends AbstractEntity {
  @ManyToOne(() => Batch, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => CustomField, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'custom_field_id' })
  customField: CustomField;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  value: string;
}
