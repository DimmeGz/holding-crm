import { CustomField } from './custom-field.entity';
import { Batch } from './batch.entity';
import { AbstractEntity } from '../../common/entities';
import { CountryOfOrigin, TechnicalProcess } from '../../libs/entities';
export declare class Product extends AbstractEntity {
    name: string;
    description: string;
    description2: string;
    cnCode: string;
    countryOfOrigin: CountryOfOrigin;
    cas: string;
    customFields: CustomField[];
    batches: Batch[];
    technicalProcesses: TechnicalProcess[];
}
