import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnicalProcess } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class LibsService {
  constructor(
    @InjectRepository(TechnicalProcess)
    private readonly technicalProcessesRepository: Repository<TechnicalProcess>,
  ) {}

  async getTechnicalProcessesByInvoiceIds(invoiceIds: number[]) {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.invoices', 'invoice')
      .where('invoice.id IN (:...invoiceIds)', { invoiceIds })
      .select('technicalProcess.id')
      .getMany();
  }

  async getTechnicalProcessesByCommissionInvoiceId(
    commissionInvoiceId: number,
  ) {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.commissionInvoices', 'commissionInvoice')
      .where('commissionInvoice.id = :commissionInvoiceId', {
        commissionInvoiceId,
      })
      .select('technicalProcess.id')
      .getMany();
  }
}
