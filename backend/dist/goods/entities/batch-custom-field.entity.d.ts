import { AbstractEntity } from '../../common/entities';
import { Batch } from './batch.entity';
import { CustomField } from './custom-field.entity';
export declare class BatchCustomField extends AbstractEntity {
    batch: Batch;
    customField: CustomField;
    value: string;
}
