import { Repository } from 'typeorm';
import { CompaniesService } from '../../companies';
import { LibsService } from '../../libs';
import { CommissionPayment } from './entities';
import { CreateCommissionPaymentDTO, UpdateCommissionPaymentDTO } from './dto';
export declare class CommissionPaymentService {
    private readonly commissionPaymentsRepository;
    private readonly companiesService;
    private readonly libsService;
    constructor(commissionPaymentsRepository: Repository<CommissionPayment>, companiesService: CompaniesService, libsService: LibsService);
    private createBaseQueryBuilder;
    private applyBaseSelect;
    getCommisionPayments(): Promise<CommissionPayment[]>;
    getCommisionPaymentById(commissionPaymentId: number): Promise<CommissionPayment>;
    createCommissionPayment(createCommissionPaymentDTO: CreateCommissionPaymentDTO): Promise<CommissionPayment>;
    updateCommissionPayment(commissionPaymentId: number, updateCommissionPaymentDTO: UpdateCommissionPaymentDTO): Promise<CommissionPayment>;
    removeCommissionPayment(commissionPaymentId: number): Promise<CommissionPayment>;
    changeCommissionPaymentStatus(commissionPaymentId: number): Promise<CommissionPayment>;
}
