import { BasePaymentDTO } from './base-payment.dto';
import { CreatePaymentLineDTO } from './create-payment-line.dto';
import { UpdatePaymentLineDTO } from './update-payment-line.dto';
declare const UpdatePaymentDTO_base: import("@nestjs/mapped-types").MappedType<Partial<BasePaymentDTO>>;
export declare class UpdatePaymentDTO extends UpdatePaymentDTO_base {
    paymentLines: (CreatePaymentLineDTO | UpdatePaymentLineDTO)[];
}
export {};
