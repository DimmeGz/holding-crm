import { IsInt, IsPositive } from 'class-validator';

import { CreateInvoiceLineByContractDTO } from './create-invoice-line-by-contract.dto';

export class CreateInvoiceLineDTO extends CreateInvoiceLineByContractDTO {
  @IsPositive()
  @IsInt()
  orderId: number;
}
