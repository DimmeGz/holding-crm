import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryOfOrigin, Currency, Incoterms, TechnicalProcess } from './entities';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class LibsService {
  constructor(
    @InjectRepository(TechnicalProcess)
    private readonly technicalProcessesRepository: Repository<TechnicalProcess>,
    @InjectRepository(Currency)
    private readonly currenciesRepository: Repository<Currency>,
    @InjectRepository(CountryOfOrigin)
    private readonly countriesOfOriginRepository: Repository<CountryOfOrigin>,
    @InjectRepository(Incoterms)
    private readonly incotermsRepository: Repository<Incoterms>,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<TechnicalProcess> {
    return this.technicalProcessesRepository
      .createQueryBuilder('technicalProcess')
      .select('technicalProcess.id');
  }

  async getTechnicalProcessesByInvoiceIds(
    invoiceIds: number[],
  ): Promise<TechnicalProcess[]> {
    return await this.createBaseQueryBuilder()
      .leftJoin('technicalProcess.invoices', 'invoice')
      .where('invoice.id IN (:...invoiceIds)', { invoiceIds })
      .getMany();
  }

  async getTechnicalProcessesByCommissionInvoiceId(
    commissionInvoiceId: number,
  ): Promise<TechnicalProcess[]> {
    return await this.createBaseQueryBuilder()
      .leftJoin('technicalProcess.commissionInvoices', 'commissionInvoice')
      .where('commissionInvoice.id = :commissionInvoiceId', {
        commissionInvoiceId,
      })
      .getMany();
  }

  async getTechnicalProcessesByProductIds(
    productIds: number[],
  ): Promise<TechnicalProcess[]> {
    return await this.createBaseQueryBuilder()
      .leftJoin('technicalProcess.products', 'product')
      .where('product.id IN (:...productIds)', {
        productIds,
      })
      .getMany();
  }

  async getTechnicalProcessesByBatchId(
    batchId: number,
  ): Promise<TechnicalProcess[]> {
    return await this.createBaseQueryBuilder()
      .leftJoin('technicalProcess.products', 'product')
      .leftJoin('product.batches', 'batch')
      .where('batch.id = :batchId', {
        batchId,
      })
      .getMany();
  }

  async getCurrenciesStoreData() {
    return await this.currenciesRepository
      .createQueryBuilder('currency')
      .select(['currency.id', 'currency.name'])
      .getMany();
  }

  async getCountriesOfOriginStoreData() {
    return await this.countriesOfOriginRepository
      .createQueryBuilder('countryOfOrigin')
      .select(['countryOfOrigin.id', 'countryOfOrigin.name'])
      .getMany();
  }

  async getIncotermsStoreData() {
    return await this.incotermsRepository
      .createQueryBuilder('incoterms')
      .select(['incoterms.id', 'incoterms.name'])
      .getMany();
  }
}
