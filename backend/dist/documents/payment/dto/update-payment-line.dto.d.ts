import { CreatePaymentLineDTO } from './create-payment-line.dto';
declare const UpdatePaymentLineDTO_base: import("@nestjs/mapped-types").MappedType<Partial<CreatePaymentLineDTO>>;
export declare class UpdatePaymentLineDTO extends UpdatePaymentLineDTO_base {
    id: number;
    remove?: boolean;
}
export {};
