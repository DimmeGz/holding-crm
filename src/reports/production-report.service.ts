import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../companies/entities';

import { getFirstAndLastDaysOfMonth } from '../common/utils';

import { ProductionReportQueryDTO } from './dto/query-dto';
import { ProductionReportResponseDTO } from './dto/response-dto';

@Injectable()
export class ProductionReportService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
  ) {}

  async productionReport(
    companyId: number,
    query?: ProductionReportQueryDTO,
  ): Promise<ProductionReportResponseDTO> {
    const { firstMonthDay, lastMonthDay } = getFirstAndLastDaysOfMonth(
      query?.date,
    );

    const companyQB = this.companiesRepository
      .createQueryBuilder('company')
      .where('company.id = :companyId', { companyId })
      .leftJoin(
        'company.productions',
        'production',
        'production.status = true AND production.expectedDate BETWEEN :firstMonthDay AND :lastMonthDay',
        { firstMonthDay, lastMonthDay },
      )
      .select(['company.id', 'company.name', 'production.id']);

    if (query?.process) {
      companyQB
        .leftJoin('production.technicalProcesses', 'technicalProcess')
        .andWhere('technicalProcess.id = :processId', {
          processId: query.process,
        });
    }

    companyQB
      .leftJoin('production.productionInLines', 'inLine')
      .leftJoin('inLine.batch', 'inBatch')
      .leftJoin('inBatch.product', 'inProduct')
      .addSelect(['inLine.qty', 'inBatch.name', 'inProduct.name'])
      .leftJoin('production.productionOutLines', 'outLine')
      .leftJoin('outLine.batch', 'outBatch')
      .leftJoin('outBatch.product', 'outProduct')
      .addSelect(['outLine.qty', 'outBatch.name', 'outProduct.name']);

    const company = await companyQB.getOne();

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const companyData = { id: company.id, name: company.name };
    const outProductions = company.productions.map((production) => {
      delete production.productionInLines;
      return production;
    });
    const inProductions = company.productions.map((production) => {
      delete production.productionInLines;
      return production;
    });

    return {
      company: companyData,
      outProductions,
      inProductions,
    };
  }
}
