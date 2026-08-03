import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities';
import { Invoice, InvoiceLine } from '../documents/invoices/entities';
import {
  Production,
  ProductionInLine,
  ProductionOutLine,
} from '../documents/production/entities';
import { getFirstAndLastDaysOfMonth } from '../common/utils';

import { ReportQueryDTO } from './dto/query-dto';
import {
  ProductionReportDocDTO,
  ProductionReportInvoiceRef,
  ProductionReportLineDTO,
  ProductionReportResponseDTO,
} from './dto/response-dto';

@Injectable()
export class ProductionReportService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Production)
    private readonly productionsRepository: Repository<Production>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLinesRepository: Repository<InvoiceLine>,
  ) {}

  async productionReport(
    companyId: number,
    query?: ReportQueryDTO,
  ): Promise<ProductionReportResponseDTO> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: ['id', 'name'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const { firstMonthDay, lastMonthDay } = getFirstAndLastDaysOfMonth(
      query?.date,
    );

    const qb = this.productionsRepository
      .createQueryBuilder('production')
      .where('production.companyId = :companyId', { companyId })
      .andWhere('production.status = true')
      .andWhere(
        'production.expectedDate BETWEEN :firstMonthDay AND :lastMonthDay',
        { firstMonthDay, lastMonthDay },
      )
      .leftJoinAndSelect('production.productionInLines', 'inLine')
      .leftJoinAndSelect('inLine.batch', 'inBatch')
      .leftJoinAndSelect('inLine.product', 'inLineProduct')
      .leftJoinAndSelect('production.productionOutLines', 'outLine')
      .leftJoinAndSelect('outLine.batch', 'outBatch')
      .leftJoinAndSelect('outLine.product', 'outLineProduct')
      .orderBy('production.expectedDate', 'ASC')
      .addOrderBy('production.id', 'ASC');

    if (query?.process) {
      qb.leftJoin('production.technicalProcesses', 'filterProcess').andWhere(
        'filterProcess.id = :processId',
        { processId: query.process },
      );
    }

    const productions = await qb.getMany();

    const outBatchIds = new Set<number>();
    const inBatchIds = new Set<number>();

    for (const production of productions) {
      for (const line of production.productionOutLines ?? []) {
        if (line.batchId) {
          outBatchIds.add(line.batchId);
        }
      }
      for (const line of production.productionInLines ?? []) {
        if (line.batchId) {
          inBatchIds.add(line.batchId);
        }
      }
    }

    const [consumedInvoicesByBatch, producedInvoicesByBatch] = await Promise.all(
      [
        this.loadInvoicesByBatches(companyId, 'buyer', [...outBatchIds]),
        this.loadInvoicesByBatches(companyId, 'seller', [...inBatchIds]),
      ],
    );

    let outQty = 0;
    let inQty = 0;

    const outProductions: ProductionReportDocDTO[] = [];
    const inProductions: ProductionReportDocDTO[] = [];

    for (const production of productions) {
      const outLines = (production.productionOutLines ?? []).map((line) => {
        outQty += Number(line.qty) || 0;
        return this.mapLine(line, consumedInvoicesByBatch);
      });
      const inLines = (production.productionInLines ?? []).map((line) => {
        inQty += Number(line.qty) || 0;
        return this.mapLine(line, producedInvoicesByBatch);
      });

      if (outLines.length > 0) {
        outProductions.push({
          id: production.id,
          expectedDate: production.expectedDate,
          lines: outLines,
        });
      }
      if (inLines.length > 0) {
        inProductions.push({
          id: production.id,
          expectedDate: production.expectedDate,
          lines: inLines,
        });
      }
    }

    return {
      company: { id: company.id, name: company.name },
      outProductions,
      inProductions,
      outQty,
      inQty,
    };
  }

  private mapLine(
    line: ProductionInLine | ProductionOutLine,
    invoicesByBatch: Map<number, ProductionReportInvoiceRef[]>,
  ): ProductionReportLineDTO {
    return {
      id: line.id,
      qty: Number(line.qty) || 0,
      batch: line.batch
        ? { id: line.batch.id, name: line.batch.name }
        : null,
      product: line.product
        ? { id: line.product.id, name: line.product.name }
        : null,
      invoices: line.batchId
        ? (invoicesByBatch.get(line.batchId) ?? [])
        : [],
    };
  }

  /** Django production report: no invoice.status filter on batch links. */
  private async loadInvoicesByBatches(
    companyId: number,
    side: 'buyer' | 'seller',
    batchIds: number[],
  ): Promise<Map<number, ProductionReportInvoiceRef[]>> {
    const result = new Map<number, ProductionReportInvoiceRef[]>();
    if (batchIds.length === 0) {
      return result;
    }

    const qb = this.invoiceLinesRepository
      .createQueryBuilder('line')
      .innerJoinAndSelect('line.invoice', 'invoice')
      .where('line.batchId IN (:...batchIds)', { batchIds });

    if (side === 'buyer') {
      qb.andWhere('invoice.buyerId = :companyId', { companyId });
    } else {
      qb.andWhere('invoice.sellerId = :companyId', { companyId });
    }

    const lines = await qb.getMany();

    for (const line of lines) {
      const invoice = line.invoice as Invoice | undefined;
      if (!invoice || !line.batchId) {
        continue;
      }
      const list = result.get(line.batchId) ?? [];
      if (!list.some((item) => item.id === invoice.id)) {
        list.push({ id: invoice.id, number: invoice.invoiceNumber });
      }
      result.set(line.batchId, list);
    }

    return result;
  }
}
