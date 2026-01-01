import { AbstractDocumentRecipientEntity } from '../../entities';
import { Incoterms, TechnicalProcess } from '../../../libs/entities';
import { Contract } from '../../contracts/entities';
import { OrderLine } from './order-line.entity';
import { OrderConfirmation } from '../../orders-confirmation/entities';
import { OrderServiceLine } from './order-service-line.entity';
export declare class Order extends AbstractDocumentRecipientEntity<Order> {
    paymentDelay: number;
    status: boolean;
    signatureDate: Date;
    vat: number;
    documentSum: number;
    carPlate: string;
    orderNumber: string;
    expectedDate: Date;
    confirmExpectedDate: Date;
    sortingDate: Date;
    isDateAsap: boolean;
    contract: Contract;
    contractId: number;
    incoterms: Incoterms;
    incotermsId: number;
    transportPlace: string;
    isHidden: boolean;
    technicalProcesses: Partial<TechnicalProcess>[];
    orderLines: Partial<OrderLine>[];
    orderServiceLines: Partial<OrderServiceLine>[];
    orderConfirmations: OrderConfirmation[];
}
