import { AbstractDocumentEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { ContractLine } from './contract-line.entity';
import { ContractServiceLine } from './contract-service-line.entity';
export declare class Contract extends AbstractDocumentEntity<Contract> {
    technicalProcesses: Partial<TechnicalProcess>[];
    paymentDelay: number;
    signatureDate: Date;
    vat: number;
    name: string;
    term: Date;
    parent: Contract;
    parentId: number;
    children: Contract[];
    incoterms: Incoterms;
    incotermsId: number;
    transportPlace: string;
    orderPrefix: string;
    isArchived: boolean;
    contractLines: Partial<ContractLine>[];
    contractServiceLines: Partial<ContractServiceLine>[];
}
