import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';

import { Company } from '../companies/entities';
import { WarehouseAccounting } from '../warehouse/entities';
import { MonthData } from './entities';
import {
  buildType0Quarters,
  buildType1Quarters,
  buildType3Quarters,
  cashflowPreviousFromRows,
  computeType0Finals,
  computeType1Finals,
  computeType3Finals,
  mapType0MonthViews,
  mapType1MonthViews,
  mapType3MonthViews,
  nextJanuaryFirst,
  resolveYear,
  yearMonthBounds,
  monthNumberFromDate,
} from './helpers/year-report.helpers';
import { round3 } from './helpers';
import { shiftMonth } from './helpers/report-period.helpers';
import { ReportTypeEnum } from './types/month-report.types';
import {
  YearMonthRow,
  YearReportCompanyRef,
  YearReportResponse,
} from './types/year-report.types';

@Injectable()
export class YearReportService {
  constructor(
    @InjectRepository(MonthData)
    private readonly monthDataRepository: Repository<MonthData>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(WarehouseAccounting)
    private readonly warehouseAccountingRepository: Repository<WarehouseAccounting>,
  ) {}

  async yearReport(
    companyId: number,
    date?: string,
  ): Promise<YearReportResponse> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: { id: true, name: true, reportType: true },
    });
    if (!company) {
      throw new NotFoundException(`Company with id: ${companyId} not found`);
    }

    const year = resolveYear(date);
    const companyRef: YearReportCompanyRef = {
      id: company.id,
      name: company.name,
      reportType: company.reportType,
    };

    if (company.reportType === ReportTypeEnum.TYPE_2) {
      return {
        company: companyRef,
        year,
        reportType: ReportTypeEnum.TYPE_2,
        supported: false,
      };
    }

    const { from, to } = yearMonthBounds(year);
    const entities = await this.monthDataRepository.find({
      where: {
        companyId,
        month: Between(from, to),
      },
      order: { month: 'ASC' },
    });

    const rows = entities.map((entity) => this.toRow(entity));
    const cashflowPrevious = cashflowPreviousFromRows(rows);
    const savedCashflow = await this.loadSavedCashflow(companyId, year);

    if (company.reportType === ReportTypeEnum.TYPE_0) {
      const quarters = buildType0Quarters(rows);
      const finals = computeType0Finals(quarters.fourth, cashflowPrevious);
      return {
        company: companyRef,
        year,
        reportType: ReportTypeEnum.TYPE_0,
        supported: true,
        months: mapType0MonthViews(rows),
        quarters,
        cashflowPrevious: round3(cashflowPrevious),
        savedCashflow: round3(savedCashflow),
        ...finals,
      };
    }

    const totalWareAmount = await this.loadTotalWareAmount(companyId, year);

    if (company.reportType === ReportTypeEnum.TYPE_1) {
      const quarters = buildType1Quarters(rows);
      const finals = computeType1Finals(quarters.fourth, cashflowPrevious);
      return {
        company: companyRef,
        year,
        reportType: ReportTypeEnum.TYPE_1,
        supported: true,
        months: mapType1MonthViews(rows),
        quarters,
        cashflowPrevious: round3(cashflowPrevious),
        savedCashflow: round3(savedCashflow),
        totalWareAmount,
        ...finals,
      };
    }

    // Type 3
    const enriched = await this.enrichType3Vat(companyId, rows);
    const quarters = buildType3Quarters(enriched);
    const finals = computeType3Finals(quarters.fourth, cashflowPrevious);
    return {
      company: companyRef,
      year,
      reportType: ReportTypeEnum.TYPE_3,
      supported: true,
      months: mapType3MonthViews(enriched),
      quarters,
      cashflowPrevious: round3(cashflowPrevious),
      savedCashflow: round3(savedCashflow),
      totalWareAmount,
      ...finals,
    };
  }

  private toRow(entity: MonthData): YearMonthRow {
    const month =
      typeof entity.month === 'string'
        ? entity.month.slice(0, 10)
        : String(entity.month).slice(0, 10);
    return {
      month,
      monthNumber: monthNumberFromDate(month),
      outPay: Number(entity.outPay) || 0,
      inPay: Number(entity.inPay) || 0,
      outSum: Number(entity.outSum) || 0,
      inSum: Number(entity.inSum) || 0,
      outVat: Number(entity.outVat) || 0,
      inVat: Number(entity.inVat) || 0,
      outTransport: Number(entity.outTransport) || 0,
      inTransport: Number(entity.inTransport) || 0,
      commission: Number(entity.commission) || 0,
      commissionPay: Number(entity.commissionPay) || 0,
      commissionLeft: Number(entity.commissionLeft) || 0,
      delta: Number(entity.delta) || 0,
      operatingOutgoings: Number(entity.operatingOutgoings) || 0,
      cashflow: Number(entity.cashflow) || 0,
      warehouse: Number(entity.warehouse) || 0,
      factVatReturn:
        entity.factVatReturn === null || entity.factVatReturn === undefined
          ? null
          : Number(entity.factVatReturn),
    };
  }

  private async loadSavedCashflow(
    companyId: number,
    year: number,
  ): Promise<number> {
    const nextJan = nextJanuaryFirst(year);
    const saved = await this.monthDataRepository.findOne({
      where: { companyId, month: nextJan },
      select: { cashflow: true },
    });
    return Number(saved?.cashflow) || 0;
  }

  private async loadTotalWareAmount(
    companyId: number,
    year: number,
  ): Promise<number> {
    if (year !== new Date().getFullYear()) {
      return 0;
    }
    const lines = await this.warehouseAccountingRepository.find({
      where: { companyId },
      select: { qty: true, cost: true },
    });
    let total = 0;
    for (const line of lines) {
      total += (Number(line.qty) || 0) * (Number(line.cost) || 0);
    }
    return round3(total);
  }

  private async enrichType3Vat(
    companyId: number,
    rows: YearMonthRow[],
  ): Promise<YearMonthRow[]> {
    const lookupMonths = new Set<string>();
    for (const row of rows) {
      const yyyyMm = row.month.slice(0, 7);
      lookupMonths.add(`${shiftMonth(yyyyMm, -2)}-01`);
    }

    const lookups =
      lookupMonths.size === 0
        ? []
        : await this.monthDataRepository.find({
            where: {
              companyId,
              month: In([...lookupMonths]),
            },
            select: { month: true, inVat: true, outVat: true },
          });

    const byMonth = new Map<string, { inVat: number; outVat: number }>();
    for (const item of lookups) {
      const key =
        typeof item.month === 'string'
          ? item.month.slice(0, 10)
          : String(item.month).slice(0, 10);
      byMonth.set(key, {
        inVat: Number(item.inVat) || 0,
        outVat: Number(item.outVat) || 0,
      });
    }

    return rows.map((row) => {
      // Django: if obj.fact_vat_return (truthy) — use as fact
      if (row.factVatReturn) {
        return {
          ...row,
          vatReturn: row.factVatReturn,
          isVatFact: true,
        };
      }

      const yyyyMm = row.month.slice(0, 7);
      const priorKey = `${shiftMonth(yyyyMm, -2)}-01`;
      const prior = byMonth.get(priorKey);
      return {
        ...row,
        vatReturn: prior ? prior.inVat - prior.outVat : 0,
        isVatFact: false,
      };
    });
  }
}
