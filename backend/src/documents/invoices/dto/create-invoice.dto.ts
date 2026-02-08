import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineDTO } from './create-invoice-line.dto';
import { CreateServiceLineDTO } from '../../common/dto';

export class CreateInvoiceDTO extends BaseInvoiceDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineDTO)
  invoiceLines: CreateInvoiceLineDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  invoiceServiceLines: CreateServiceLineDTO[];
}
