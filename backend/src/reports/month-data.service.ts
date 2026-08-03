import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities';
import { MonthData } from './entities';
import { UpdateMonthDataDTO } from './dto/update-month-data.dto';
import { MonthReportService } from './month-report.service';
import { monthFirstDay } from './helpers';
import { ReportTypeEnum } from './types/month-report.types';

@Injectable()
export class MonthDataService {
  constructor(
    @InjectRepository(MonthData)
    private readonly monthDataRepository: Repository<MonthData>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly monthReportService: MonthReportService,
  ) {}

  async upsert(
    companyId: number,
    dto: UpdateMonthDataDTO,
  ): Promise<MonthData> {
    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: { id: true, reportType: true },
    });
    if (!company) {
      throw new NotFoundException(`Company with id: ${companyId} not found`);
    }

    const { snapshot } = await this.monthReportService.computeSnapshot(
      companyId,
      dto.month,
      dto.process,
    );

    const month = monthFirstDay(dto.month);
    let entity = await this.monthDataRepository.findOne({
      where: { companyId, month },
    });

    if (!entity) {
      entity = this.monthDataRepository.create({
        companyId,
        month,
        cashflow: 0,
        warehouse: 0,
      });
    }

    // Preserve cashflow / warehouse from existing row.
    const cashflow = Number(entity.cashflow) || 0;
    const warehouse = Number(entity.warehouse) || 0;

    Object.assign(entity, {
      ...snapshot,
      operatingOutgoings: dto.operatingOutgoings,
      factVatReturn:
        company.reportType === ReportTypeEnum.TYPE_3
          ? (dto.factVatReturn ?? null)
          : entity.factVatReturn ?? null,
      cashflow,
      warehouse,
    });

    return this.monthDataRepository.save(entity);
  }
}
