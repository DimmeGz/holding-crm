import { DataSource, Repository } from 'typeorm';
import { CompaniesService } from '../../companies';
import { InvoiceService } from '../invoice';
import { LibsService } from '../../libs';
import { Payment } from './entities';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { BaseDocumentsQueryDTO } from '../common/dto/query-dto';
export declare class PaymentService {
    private readonly paymentsRepository;
    private dataSource;
    private readonly invoiceService;
    private readonly companiesService;
    private readonly libsService;
    constructor(paymentsRepository: Repository<Payment>, dataSource: DataSource, invoiceService: InvoiceService, companiesService: CompaniesService, libsService: LibsService);
    private createBaseQueryBuilder;
    private applyPaymentListSelect;
    private applyPaymentDetailSelect;
    private applyQueryFilter;
    getPayments(query?: BaseDocumentsQueryDTO): Promise<Payment[]>;
    getPaymentById(paymentId: number): Promise<Payment>;
    getPaymentsByInvoiceId(invoiceId: number): Promise<Payment[]>;
    createPayment(createPaymentDTO: CreatePaymentDTO): Promise<Payment>;
    private extractPaymentLinesData;
    updatePayment(paymentId: number, updatePaymentDTO: UpdatePaymentDTO): Promise<Payment>;
    removePayment(paymentId: number): Promise<Payment>;
    changePaymentStatus(paymentId: number): Promise<Payment>;
}
