import { PartialType } from '@nestjs/mapped-types';

import { IsBoolean, IsInt, IsOptional, IsPositive } from 'class-validator';

import { CreateInvoiceLineDTO } from './create-invoice-line.dto';

export class UpdateInvoiceLineDTO extends PartialType(CreateInvoiceLineDTO) {
  @IsPositive()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  remove?: boolean;
}
