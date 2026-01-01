import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BaseInvoiceDTO } from './base-invoice.dto';
import { CreateInvoiceLineByContractDTO } from './create-invoice-line-by-contract.dto';
import { CreateServiceLineDTO } from '../../common/dto';

export class CreateInvoiceByContractDTO extends BaseInvoiceDTO {
  @IsPositive()
  @IsInt()
  contractId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceLineByContractDTO)
  invoiceLines: CreateInvoiceLineByContractDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateServiceLineDTO)
  invoiceServiceLines: CreateServiceLineDTO[];
}
