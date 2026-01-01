import { PaymentService } from './payment.service';
import { Payment } from './entities';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { BaseDocumentsQueryDTO } from '../common/dto/query-dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    getPayments(query?: BaseDocumentsQueryDTO): Promise<Payment[]>;
    getPaymentById(paymentId: number): Promise<Payment>;
    createPayment(createPaymentDTO: CreatePaymentDTO): Promise<Payment>;
    updatePayment(paymentId: number, updatePaymentDTO: UpdatePaymentDTO): Promise<Payment>;
    removePayment(paymentId: number): Promise<Payment>;
    changeInvoiceStatus(paymentId: number): Promise<Payment>;
}
