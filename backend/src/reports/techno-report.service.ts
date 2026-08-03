import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities';
import { Invoice } from '../documents/invoices/entities';
import { PayerType } from '../libs/enums';
import {
  TECHNO_DYUMANS_ID,
  TECHNO_EWB_ID,
  TECHNO_KLIMANA_ID,
} from './constants/techno-report.constants';
import { TechnoReportQueryDTO } from './dto/query-dto/techno-report-query.dto';
import { transportForPayer } from './helpers';
import {
  TechnoDyumansRow,
  TechnoInvoiceLineRef,
  TechnoMarginRow,
  TechnoReportResponse,
  TechnoSectionTotals,
} from './types/techno-report.types';

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthStartISODate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
}

function mapLines(invoice: Invoice): TechnoInvoiceLineRef[] {
  return (invoice.invoiceLines ?? []).map((line) => ({
    productName: line.product?.name ?? null,
    qty: Number(line.qty) || 0,
  }));
}

function sumWeight(lines: TechnoInvoiceLineRef[]): number {
  return lines.reduce((acc, line) => acc + line.qty, 0);
}

function lineMargin(invoice: Invoice): number {
  return (invoice.invoiceLines ?? []).reduce((acc, line) => {
    const price = Number(line.price) || 0;
    const cost = Number(line.cost) || 0;
    const qty = Number(line.qty) || 0;
    return acc + (price - cost) * qty;
  }, 0);
}

function emptyTotals(): TechnoSectionTotals {
  return { weight: 0, sum: 0, transport: 0, delta: 0 };
}

@Injectable()
export class TechnoReportService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
  ) {}

  async technoReport(
    query: TechnoReportQueryDTO,
  ): Promise<TechnoReportResponse> {
    const startDate = query.startDate ?? monthStartISODate();
    const endDate = query.endDate ?? todayISODate();
    const process = query.process;

    const [dyumansCompany, ewbCompany, klimanaCompany] = await Promise.all([
      this.companiesRepository.findOne({
        where: { id: TECHNO_DYUMANS_ID },
        select: ['id', 'name'],
      }),
      this.companiesRepository.findOne({
        where: { id: TECHNO_EWB_ID },
        select: ['id', 'name'],
      }),
      this.companiesRepository.findOne({
        where: { id: TECHNO_KLIMANA_ID },
        select: ['id', 'name'],
      }),
    ]);

    const [dyumans, ewbIn, ewbOut, klimana] = await Promise.all([
      this.buildDyumans(startDate, endDate, process),
      this.buildMarginSection(
        'buyer',
        TECHNO_EWB_ID,
        startDate,
        endDate,
        process,
      ),
      this.buildMarginSection(
        'seller',
        TECHNO_EWB_ID,
        startDate,
        endDate,
        process,
      ),
      this.buildMarginSection(
        'seller',
        TECHNO_KLIMANA_ID,
        startDate,
        endDate,
        process,
      ),
    ]);

    return {
      startDate,
      endDate,
      process,
      dyumans: {
        company: dyumansCompany
          ? { id: dyumansCompany.id, name: dyumansCompany.name }
          : null,
        ...dyumans,
      },
      ewbIn: {
        company: ewbCompany
          ? { id: ewbCompany.id, name: ewbCompany.name }
          : null,
        ...ewbIn,
      },
      ewbOut: {
        company: ewbCompany
          ? { id: ewbCompany.id, name: ewbCompany.name }
          : null,
        ...ewbOut,
      },
      klimana: {
        company: klimanaCompany
          ? { id: klimanaCompany.id, name: klimanaCompany.name }
          : null,
        ...klimana,
      },
    };
  }

  private async buildDyumans(
    startDate: string,
    endDate: string,
    process: number,
  ): Promise<{ rows: TechnoDyumansRow[]; totals: TechnoSectionTotals }> {
    const invoices = await this.loadInvoices({
      side: 'buyer',
      companyId: TECHNO_DYUMANS_ID,
      startDate,
      endDate,
      process,
      withChildren: true,
    });

    const rows: TechnoDyumansRow[] = [];
    const totals: TechnoSectionTotals = {
      ...emptyTotals(),
      inSum: 0,
      outSum: 0,
    };

    for (const invoice of invoices) {
      const children = [...(invoice.children ?? [])].sort(
        (a, b) => a.id - b.id,
      );
      if (children.length === 0) {
        continue;
      }
      const child = children[0];
      const lines = mapLines(invoice);
      const weight = sumWeight(lines);
      const inSum = Number(invoice.documentSum) || 0;
      const outSum = Number(child.documentSum) || 0;
      const transport =
        transportForPayer(
          invoice.transportAmount,
          invoice.incoterms?.payerType,
          PayerType.BUYER,
        ) +
        transportForPayer(
          child.transportAmount,
          child.incoterms?.payerType,
          PayerType.SELLER,
        );
      const delta = outSum - inSum - transport;

      rows.push({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        expectedDate: invoice.expectedDate,
        seller: invoice.seller
          ? { id: invoice.seller.id, name: invoice.seller.name }
          : null,
        currency: invoice.currency?.name ?? null,
        inSum,
        lines,
        weight,
        childInvoiceId: child.id,
        childInvoiceNumber: child.invoiceNumber,
        childExpectedDate: child.expectedDate,
        childBuyer: child.buyer
          ? { id: child.buyer.id, name: child.buyer.name }
          : null,
        outSum,
        transport,
        delta,
      });

      totals.weight += weight;
      totals.inSum = (totals.inSum ?? 0) + inSum;
      totals.outSum = (totals.outSum ?? 0) + outSum;
      totals.transport += transport;
      totals.delta += delta;
      totals.sum += inSum;
    }

    return { rows, totals };
  }

  private async buildMarginSection(
    side: 'buyer' | 'seller',
    companyId: number,
    startDate: string,
    endDate: string,
    process: number,
  ): Promise<{ rows: TechnoMarginRow[]; totals: TechnoSectionTotals }> {
    const invoices = await this.loadInvoices({
      side,
      companyId,
      startDate,
      endDate,
      process,
      withChildren: false,
    });

    const rows: TechnoMarginRow[] = [];
    const totals = emptyTotals();

    for (const invoice of invoices) {
      const lines = mapLines(invoice);
      const weight = sumWeight(lines);
      const sum = (invoice.invoiceLines ?? []).reduce((acc, line) => {
        return acc + (Number(line.price) || 0) * (Number(line.qty) || 0);
      }, 0);
      const transport = transportForPayer(
        invoice.transportAmount,
        invoice.incoterms?.payerType,
        PayerType.SELLER,
      );
      const margin = lineMargin(invoice);
      const delta = margin - transport;
      const partner =
        side === 'buyer'
          ? invoice.seller
            ? { id: invoice.seller.id, name: invoice.seller.name }
            : null
          : invoice.buyer
            ? { id: invoice.buyer.id, name: invoice.buyer.name }
            : null;

      rows.push({
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        expectedDate: invoice.expectedDate,
        partner,
        currency: invoice.currency?.name ?? null,
        lines,
        weight,
        sum,
        transport,
        margin,
        delta,
      });

      totals.weight += weight;
      totals.sum += sum;
      totals.transport += transport;
      totals.delta += delta;
    }

    return { rows, totals };
  }

  private async loadInvoices(options: {
    side: 'buyer' | 'seller';
    companyId: number;
    startDate: string;
    endDate: string;
    process: number;
    withChildren: boolean;
  }): Promise<Invoice[]> {
    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.incoterms', 'incoterms')
      .leftJoinAndSelect('invoice.currency', 'currency')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
      .leftJoinAndSelect('invoiceLine.product', 'product')
      .leftJoin('invoice.technicalProcesses', 'filterProcess')
      .andWhere('filterProcess.id = :processId', {
        processId: options.process,
      })
      .andWhere('invoice.reportPeriod BETWEEN :startDate AND :endDate', {
        startDate: options.startDate,
        endDate: options.endDate,
      })
      .orderBy('invoice.expectedDate', 'ASC')
      .addOrderBy('invoice.id', 'ASC');

    if (options.side === 'buyer') {
      qb.andWhere('invoice.buyerId = :companyId', {
        companyId: options.companyId,
      }).leftJoinAndSelect('invoice.seller', 'partner');
    } else {
      qb.andWhere('invoice.sellerId = :companyId', {
        companyId: options.companyId,
      }).leftJoinAndSelect('invoice.buyer', 'partner');
    }

    if (options.withChildren) {
      qb.leftJoinAndSelect('invoice.children', 'child')
        .leftJoinAndSelect('child.incoterms', 'childIncoterms')
        .leftJoinAndSelect('child.buyer', 'childBuyer')
        .addOrderBy('child.id', 'ASC');
    }

    return qb.distinct(true).getMany();
  }
}
