import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateInvoiceLineDTO } from './create-invoice-line.dto';

export class UpdateInvoiceLineDTO extends CreateInvoiceLineDTO {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
