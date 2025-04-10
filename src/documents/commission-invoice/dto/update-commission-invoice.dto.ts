import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCommissionInvoiceDTO } from './create-commission-invoice.dto';

export class UpdateCommissionInvoiceDTO extends OmitType(
  PartialType(CreateCommissionInvoiceDTO),
  ['invoiceId'],
) {}
