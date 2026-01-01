import { BaseDocumentsQueryDTO } from '../../../common/dto/query-dto';
export declare class GetInvoicesQueryDTO extends BaseDocumentsQueryDTO {
    is_ship?: 'true' | 'false';
    date?: string;
}
