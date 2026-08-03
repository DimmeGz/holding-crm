import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities';
import { Invoice } from '../documents/invoices/entities';
import { MonthData } from './entities';
import { ReportQueryDTO } from './dto/query-dto';
import {
  buildReportType0,
  buildReportType1,
  buildReportType2,
  buildReportType3,
} from './builders';
import {
  MonthDataSnapshot,
  reportPeriodRange,
  shiftMonth,
  snapshotFromType0,
  snapshotFromType1,
  snapshotFromType2,
  snapshotFromType3,
  monthFirstDay,
  isQuarterEndMonth,
  computeCountVatReturn,
} from './helpers';
import {
  MonthDataBlock,
  MonthReportResponse,
  ReportCompanyRef,
  ReportTypeEnum,
} from './types/month-report.types';

@Injectable()
export class MonthReportService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(MonthData)
    private readonly monthDataRepository: Repository<MonthData>,
  ) {}

  async monthReport(
    companyId: number,
    query?: ReportQueryDTO,
  ): Promise<MonthReportResponse> {
    const { company, date, process } = await this.resolveContext(
      companyId,
      query,
    );
    return this.buildReport(company, date, process);
  }

  /** Used by MonthDataService for live snapshot rebuild (no circular DI). */
  async computeSnapshot(
    companyId: number,
    dateYYYYMM: string,
    process?: number,
  ): Promise<{
    reportType: number;
    snapshot: MonthDataSnapshot;
  }> {
    const company = await this.findCompany(companyId);
    const report = await this.buildReport(
      {
        id: company.id,
        name: company.name,
        reportType: company.reportType,
      },
      dateYYYYMM,
      process ?? null,
    );
    return {
      reportType: company.reportType,
      snapshot: report.monthData.snapshot,
    };
  }

  private async resolveContext(
    companyId: number,
    query?: ReportQueryDTO,
  ): Promise<{
    company: ReportCompanyRef;
    date: string;
    process: number | null;
  }> {
    const companyEntity = await this.findCompany(companyId);
    const { date } = reportPeriodRange(query?.date);
    const process =
      companyEntity.reportType === ReportTypeEnum.TYPE_2
        ? null
        : (query?.process ?? null);

    return {
      company: {
        id: companyEntity.id,
        name: companyEntity.name,
        reportType: companyEntity.reportType,
      },
      date,
      process,
    };
  }

  private async findCompany(companyId: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: { id: true, name: true, reportType: true },
    });
    if (!company) {
      throw new NotFoundException(`Company with id: ${companyId} not found`);
    }
    return company;
  }

  private async buildReport(
    company: ReportCompanyRef,
    date: string,
    process: number | null,
  ): Promise<MonthReportResponse> {
    const monthData = await this.loadMonthDataBlock(
      company.id,
      date,
      company.reportType,
    );

    switch (company.reportType) {
      case ReportTypeEnum.TYPE_0:
        return this.buildType0(company, date, process, monthData);
      case ReportTypeEnum.TYPE_1:
        return this.buildType1(company, date, process, monthData);
      case ReportTypeEnum.TYPE_2:
        return this.buildType2(company, date, monthData);
      case ReportTypeEnum.TYPE_3:
        return this.buildType3(company, date, process, monthData);
      default:
        throw new BadRequestException(
          `Invalid reportType: ${company.reportType}`,
        );
    }
  }

  private async loadMonthDataBlock(
    companyId: number,
    date: string,
    reportType: number,
  ): Promise<MonthDataBlock> {
    const saved = await this.monthDataRepository.findOne({
      where: {
        companyId,
        month: monthFirstDay(date),
      },
    });

    let countVatReturn: number | null = null;
    if (reportType === ReportTypeEnum.TYPE_3) {
      const prior = await this.monthDataRepository.findOne({
        where: {
          companyId,
          month: monthFirstDay(shiftMonth(date, -2)),
        },
      });
      countVatReturn = computeCountVatReturn(
        prior
          ? { inVat: Number(prior.inVat), outVat: Number(prior.outVat) }
          : null,
      );
    }

    return {
      saved: saved
        ? {
            operatingOutgoings: Number(saved.operatingOutgoings) || 0,
            factVatReturn:
              saved.factVatReturn === null || saved.factVatReturn === undefined
                ? null
                : Number(saved.factVatReturn),
            cashflow: Number(saved.cashflow) || 0,
            warehouse: Number(saved.warehouse) || 0,
          }
        : null,
      snapshot: {
        inQty: 0,
        inSum: 0,
        inVat: 0,
        inTransport: 0,
        inPay: 0,
        outQty: 0,
        outSum: 0,
        outVat: 0,
        outTransport: 0,
        outPay: 0,
        commission: 0,
        commissionPay: 0,
        commissionLeft: 0,
        delta: 0,
      },
      countVatReturn,
    };
  }

  private async buildType0(
    company: ReportCompanyRef,
    date: string,
    process: number | null,
    monthData: MonthDataBlock,
  ): Promise<MonthReportResponse> {
    const incomes = await this.loadInvoices({
      companyId: company.id,
      date,
      role: 'buyer',
      process,
      withChildrenGraph: true,
    });
    const parentIds = incomes.map((i) => i.id);
    const children = parentIds.length
      ? await this.loadChildren(parentIds)
      : [];
    const childInvoicesByParentId = new Map<number, Invoice[]>();
    for (const child of children) {
      const list = childInvoicesByParentId.get(child.parentId) ?? [];
      list.push(child);
      childInvoicesByParentId.set(child.parentId, list);
    }

    const separationOrderIds = [
      ...new Set(
        incomes
          .filter((inv) => inv.separation)
          .flatMap((inv) =>
            (inv.invoiceLines ?? [])
              .map((line) => line.orderId)
              .filter(Boolean),
          ),
      ),
    ];
    const orderOutInvoices = separationOrderIds.length
      ? await this.loadInvoicesByOrderIds(separationOrderIds, parentIds)
      : [];

    const report = buildReportType0({
      company,
      date,
      process,
      incomeInvoices: incomes,
      childInvoicesByParentId,
      orderOutInvoices,
      monthData,
    });
    report.monthData = {
      ...monthData,
      snapshot: snapshotFromType0(report.totals),
    };
    return report;
  }

  private async buildType1(
    company: ReportCompanyRef,
    date: string,
    process: number | null,
    monthData: MonthDataBlock,
  ): Promise<MonthReportResponse> {
    const [incomes, outgoings] = await Promise.all([
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'buyer',
        process,
        orderBy: 'reportPeriod',
      }),
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'seller',
        process,
        orderBy: 'number',
      }),
    ]);

    const report = buildReportType1({
      company,
      date,
      process,
      incomes,
      outgoings,
      monthData,
    });
    report.monthData = {
      ...monthData,
      snapshot: snapshotFromType1({
        income: report.incomeTotal,
        outgoing: report.outgoingTotal,
      }),
    };
    return report;
  }

  private async buildType2(
    company: ReportCompanyRef,
    date: string,
    monthData: MonthDataBlock,
  ): Promise<MonthReportResponse> {
    const [incomes, outgoings] = await Promise.all([
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'buyer',
        process: null,
      }),
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'seller',
        process: null,
      }),
    ]);

    const report = buildReportType2({
      company,
      date,
      incomes,
      outgoings,
      monthData,
    });
    report.monthData = {
      ...monthData,
      snapshot: snapshotFromType2({
        inQty: report.inQty,
        inSum: report.inSum,
        outQty: report.outQty,
        outSum: report.outSum,
      }),
    };
    return report;
  }

  private async buildType3(
    company: ReportCompanyRef,
    date: string,
    process: number | null,
    monthData: MonthDataBlock,
  ): Promise<MonthReportResponse> {
    const [incomes, outgoings, doubles] = await Promise.all([
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'buyer',
        process,
        withServices: true,
      }),
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'seller',
        process,
        withServices: true,
        withProcesses: true,
      }),
      this.loadInvoices({
        companyId: company.id,
        date,
        role: 'buyer',
        process,
        withServices: true,
        reportDuplicating: true,
      }),
    ]);

    let quarterOutgoings: Invoice[] = [];
    if (isQuarterEndMonth(date)) {
      const month = Number(date.split('-')[1]);
      const year = Number(date.split('-')[0]);
      const startMonth = month - 2;
      quarterOutgoings = await this.loadInvoices({
        companyId: company.id,
        date,
        role: 'seller',
        process: null,
        withProcesses: true,
        customPeriod: {
          firstMonthDay: new Date(year, startMonth - 1, 1),
          lastMonthDay: new Date(year, month, 0),
        },
      });
    }

    const report = buildReportType3({
      company,
      date,
      process,
      incomes,
      outgoings,
      doubles,
      quarterOutgoings,
      monthData,
    });
    report.monthData = {
      ...monthData,
      snapshot: snapshotFromType3({
        inTotalQty: report.inTotalQty,
        inSum: report.inSum,
        inVatSum: report.inVatSum,
        inTotalTransport: report.inTotalTransport,
        inPaySum: report.inPaySum,
        outTotalQty: report.outTotalQty,
        outSum: report.outSum,
        outVatSum: report.outVatSum,
        outTotalTransport: report.outTotalTransport,
        outPaySum: report.outPaySum,
        outCost: report.outCost,
        doubledSum: report.doubledSum,
      }),
    };
    return report;
  }

  private async loadChildren(parentIds: number[]): Promise<Invoice[]> {
    return this.invoicesRepository
      .createQueryBuilder('invoice')
      .where('invoice.parentId IN (:...parentIds)', { parentIds })
      .andWhere('invoice.status = true')
      .leftJoinAndSelect('invoice.buyer', 'buyer')
      .leftJoinAndSelect('invoice.incoterms', 'incoterms')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
      .leftJoinAndSelect('invoiceLine.order', 'order')
      .leftJoinAndSelect('order.seller', 'orderSeller')
      .leftJoinAndSelect('invoice.invoiceServiceLines', 'serviceLine')
      .leftJoinAndSelect('invoice.paymentLines', 'paymentLine')
      .leftJoinAndSelect('paymentLine.payment', 'payment')
      .getMany();
  }

  /** Django separation: outs by order among posted invoices, excluding incomes. */
  private async loadInvoicesByOrderIds(
    orderIds: number[],
    excludeInvoiceIds: number[],
  ): Promise<Invoice[]> {
    if (!orderIds.length) {
      return [];
    }

    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .innerJoin('invoice.invoiceLines', 'filterLine')
      .where('invoice.status = true')
      .andWhere('filterLine.orderId IN (:...orderIds)', { orderIds })
      .leftJoinAndSelect('invoice.buyer', 'buyer')
      .leftJoinAndSelect('invoice.incoterms', 'incoterms')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
      .leftJoinAndSelect('invoiceLine.order', 'order')
      .leftJoinAndSelect('order.seller', 'orderSeller')
      .leftJoinAndSelect('invoice.invoiceServiceLines', 'serviceLine')
      .leftJoinAndSelect('invoice.paymentLines', 'paymentLine')
      .leftJoinAndSelect('paymentLine.payment', 'payment')
      .distinct(true);

    if (excludeInvoiceIds.length) {
      qb.andWhere('invoice.id NOT IN (:...excludeInvoiceIds)', {
        excludeInvoiceIds,
      });
    }

    return qb.getMany();
  }

  private async loadInvoices(options: {
    companyId: number;
    date: string;
    role: 'buyer' | 'seller';
    process: number | null;
    orderBy?: 'reportPeriod' | 'number';
    withChildrenGraph?: boolean;
    withServices?: boolean;
    withProcesses?: boolean;
    reportDuplicating?: boolean;
    customPeriod?: { firstMonthDay: Date; lastMonthDay: Date };
  }): Promise<Invoice[]> {
    const period =
      options.customPeriod ?? reportPeriodRange(options.date).period;

    const qb = this.invoicesRepository
      .createQueryBuilder('invoice')
      .where('invoice.status = true')
      .andWhere(
        'invoice.reportPeriod BETWEEN :firstMonthDay AND :lastMonthDay',
        {
          firstMonthDay: period.firstMonthDay,
          lastMonthDay: period.lastMonthDay,
        },
      );

    if (options.role === 'buyer') {
      qb.andWhere('invoice.buyerId = :companyId', {
        companyId: options.companyId,
      });
      qb.leftJoinAndSelect('invoice.seller', 'partner');
    } else {
      qb.andWhere('invoice.sellerId = :companyId', {
        companyId: options.companyId,
      });
      qb.leftJoinAndSelect('invoice.buyer', 'partner');
    }

    if (options.reportDuplicating) {
      qb.andWhere('invoice.reportDuplicating = true');
    }

    qb.leftJoinAndSelect('invoice.incoterms', 'incoterms')
      .leftJoinAndSelect('invoice.invoiceLines', 'invoiceLine')
      .leftJoinAndSelect('invoiceLine.product', 'product')
      .leftJoinAndSelect('invoiceLine.order', 'order')
      .leftJoinAndSelect('order.seller', 'orderSeller')
      .leftJoinAndSelect('invoice.paymentLines', 'paymentLine')
      .leftJoinAndSelect('paymentLine.payment', 'payment');

    if (options.withServices || options.withChildrenGraph) {
      qb.leftJoinAndSelect('invoice.invoiceServiceLines', 'serviceLine').leftJoinAndSelect(
        'serviceLine.service',
        'service',
      );
    }

    if (options.withChildrenGraph) {
      qb.leftJoinAndSelect(
        'invoice.commissionInvoices',
        'commissionInvoice',
        'commissionInvoice.status = true',
      )
        .leftJoinAndSelect(
          'commissionInvoice.commissionPayments',
          'commissionPayment',
        )
        .leftJoinAndSelect(
          'commissionPayment.commissionPaymentLines',
          'commissionPaymentLine',
        );
    }

    if (options.withProcesses) {
      qb.leftJoinAndSelect('invoice.technicalProcesses', 'technicalProcess');
    }

    if (options.process) {
      qb.leftJoin('invoice.technicalProcesses', 'filterProcess').andWhere(
        'filterProcess.id = :processId',
        { processId: options.process },
      );
    }

    if (options.orderBy === 'number') {
      qb.orderBy('invoice.invoiceNumber', 'ASC');
    } else {
      qb.orderBy('invoice.reportPeriod', 'ASC');
    }

    return qb.distinct(true).getMany();
  }
}
