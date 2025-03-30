import { Controller, Get } from '@nestjs/common';

import { CommissionInvoiceService } from './commission-invoice.service';

@Controller('commissions')
export class CommissionInvoiceController {
  constructor(
    private readonly commissionInvoiceService: CommissionInvoiceService,
  ) {}

  @Get()
  getCommissions() {
    return this.commissionInvoiceService.getCommissions();
  }
}
