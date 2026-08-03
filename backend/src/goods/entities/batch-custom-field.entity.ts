import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { AbstractEntity } from '../../common/entities';
import { Batch } from './batch.entity';
import { CustomField } from './custom-field.entity';

@Entity({ name: 'warehouse_batchescustomfields' })
@Unique(['batchId', 'customFieldId'])
export class BatchCustomField extends AbstractEntity {
  @ManyToOne(() => Batch, (batch) => batch.customFields, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ name: 'batch_id' })
  batchId: number;

  @ManyToOne(() => CustomField, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'custom_field_id' })
  customField: CustomField;

  @Column({ name: 'custom_field_id' })
  customFieldId: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  value: string;
}
