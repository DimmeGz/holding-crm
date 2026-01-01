import { CreateCommissionPaymentDTO } from './create-commission-payment.dto';
declare const UpdateCommissionPaymentDTO_base: import("@nestjs/mapped-types").MappedType<Pick<Partial<CreateCommissionPaymentDTO>, "expectedDate" | "amount">>;
export declare class UpdateCommissionPaymentDTO extends UpdateCommissionPaymentDTO_base {
}
export {};
