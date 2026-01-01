import { CommissionPaymentService } from './commission-payment.service';
import { CreateCommissionPaymentDTO, UpdateCommissionPaymentDTO } from './dto';
import { CommissionPayment } from './entities';
export declare class CommissionPaymentController {
    private readonly commissionPaymentService;
    constructor(commissionPaymentService: CommissionPaymentService);
    getCommisionPayments(): Promise<CommissionPayment[]>;
    getCommisionPaymentById(commissionPaymentId: number): Promise<CommissionPayment>;
    createCommissionPayment(createCommissionPaymentDTO: CreateCommissionPaymentDTO): Promise<CommissionPayment>;
    updateCommissionPayment(commissionPaymentId: number, updateCommissionPaymentDTO: UpdateCommissionPaymentDTO): Promise<CommissionPayment>;
    removeCommissionPayment(commissionPaymentId: number): Promise<CommissionPayment>;
    changeCommissionPaymentStatus(commissionPaymentId: number): Promise<CommissionPayment>;
}
