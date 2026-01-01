import { AbstractEntity } from '../../common/entities';
import { TechnicalProcess } from '../../libs/entities';
export declare class Service extends AbstractEntity {
    name: string;
    technicalProcesses: TechnicalProcess[];
}
