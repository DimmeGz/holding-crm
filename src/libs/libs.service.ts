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

  async getTechnicalProcessesByInvoiceIds(
    invoiceIds: number[],
  ): Promise<TechnicalProcess[]> {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.invoices', 'invoice')
      .where('invoice.id IN (:...invoiceIds)', { invoiceIds })
      .select('technicalProcess.id')
      .getMany();
  }

  async getTechnicalProcessesByCommissionInvoiceId(
    commissionInvoiceId: number,
  ): Promise<TechnicalProcess[]> {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.commissionInvoices', 'commissionInvoice')
      .where('commissionInvoice.id = :commissionInvoiceId', {
        commissionInvoiceId,
      })
      .select('technicalProcess.id')
      .getMany();
  }

  async getTechnicalProcessesByProductIds(
    productIds: number[],
  ): Promise<TechnicalProcess[]> {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.products', 'product')
      .where('product.id IN (:...productIds)', {
        productIds,
      })
      .select('technicalProcess.id')
      .getMany();
  }

  async getTechnicalProcessesByBatchId(
    batchId: number,
  ): Promise<TechnicalProcess[]> {
    return await this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .leftJoin('technicalProcess.products', 'product')
      .leftJoin('product.batches', 'batch')
      .where('batch.id = :batchId', {
        batchId,
      })
      .select('technicalProcess.id')
      .getMany();
  }
}
