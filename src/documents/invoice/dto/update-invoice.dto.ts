import { ArrayNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineDTO } from './create-invoice-line.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { UpdateInvoiceLineDTO } from './update-invoice-line.dto';
import { IsOneOfDtos } from '../../../common/decorators';

export class UpdateInvoiceDTO extends BaseInvoiceDTO {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Object)
  @IsOneOfDtos(CreateInvoiceLineDTO, UpdateInvoiceLineDTO)
  invoiceLines: (CreateInvoiceLineDTO | UpdateInvoiceLineDTO)[];

  @IsOptional()
  @IsArray()
  @Type(() => Object)
  @IsOneOfDtos(CreateServiceLineDTO, UpdateServiceLineDTO)
  invoiceServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
