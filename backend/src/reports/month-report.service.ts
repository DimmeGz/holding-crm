import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Invoice } from '../documents/invoices/entities';
import { Company } from '../companies/entities';

import { ReportQueryDTO } from './dto/query-dto';
import { getFirstAndLastDaysOfMonth } from '../common/utils';
import { DatePeriodDTO } from '../common/dto';

interface ReportTypeFunction {
  (companyId: number, query?: ReportQueryDTO): Promise<any>;
}

enum ReportTypeEnum {
  REPORT_TYPE_1 = 1,
}

@Injectable()
export class MonthReportService {
  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
  ) {}

  private readonly REPORT_TYPE_DICT: {
    [key in ReportTypeEnum]: ReportTypeFunction;
  } = {
    [ReportTypeEnum.REPORT_TYPE_1]: this.getReportType1.bind(this),
  };

  async monthReport(companyId: number, query?: ReportQueryDTO): Promise<any> {
    const datePeriod = getFirstAndLastDaysOfMonth(query?.date);

    const company = await this.companiesRepository.findOne({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        reportType: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company with id: ${companyId} not found`);
    }

    const reportFunction = this.REPORT_TYPE_DICT[company.reportType];

    if (!reportFunction) {
      throw new BadRequestException(
        `Invalid reportType: ${company.reportType}`,
      );
    }

    const { incomeInvoices, outcomeInvoices } = await reportFunction(
      companyId,
      datePeriod,
      query,
    );

    return { company, incomeInvoices, outcomeInvoices };
  }

  private async getReportType1(
    companyId: number,
    datePeriod: DatePeriodDTO,
    query?: ReportQueryDTO,
  ) {
    const incomeInvoices = await this.getInvoices(
      companyId,
      datePeriod,
      'income',
      query,
    );

    const outcomeInvoices = await this.getInvoices(
      companyId,
      datePeriod,
      'outcome',
      query,
    );

    return {
      incomeInvoices,
      outcomeInvoices,
    };
  }

  private async getInvoices(
    companyId: number,
    datePeriod: DatePeriodDTO,
    type: 'income' | 'outcome',
    query?: ReportQueryDTO,
  ): Promise<Invoice[]> {
    const invoicesQuery = this.invoicesRepository.createQueryBuilder('invoice');

    if (type === 'income') {
      invoicesQuery
        .where('invoice.buyerId = :companyId', { companyId })
        .leftJoin('invoice.buyer', 'partner');
    } else if (type === 'outcome') {
      invoicesQuery
        .where('invoice.sellerId = :companyId', { companyId })
        .leftJoin('invoice.seller', 'partner');
    }

    invoicesQuery
      .andWhere(
        'invoice.expectedDate BETWEEN :firstMonthDay AND :lastMonthDay',
        {
          firstMonthDay: datePeriod.firstMonthDay,
          lastMonthDay: datePeriod.lastMonthDay,
        },
      )
      .andWhere('invoice.status = true')
      .leftJoin('invoice.invoiceLines', 'invoiceLine')
      .leftJoin('invoiceLine.product', 'product')
      .leftJoin('invoiceLine.batch', 'batch')
      .leftJoin('invoiceLine.order', 'order')
      .leftJoin('invoice.paymentLines', 'paymentLine')
      .leftJoin('paymentLine.payment', 'payment');

    if (query?.process) {
      invoicesQuery
        .leftJoin('invoice.technicalProcesses', 'technicalProcess')
        .andWhere('technicalProcess.id = :processId', {
          processId: query.process,
        });
    }

    invoicesQuery.select([
      'invoice.id',
      'invoice.invoiceNumber',
      'invoice.expectedDate',
      'invoice.vat',
      'invoice.documentSum',
      'invoice.paymentDelay',
      'invoice.transportAmount',
      'partner.id',
      'partner.name',
      'invoiceLine.id',
      'invoiceLine.qty',
      'invoiceLine.price',
      'product.id',
      'product.name',
      'batch.id',
      'batch.name',
      'order.id',
      'order.orderNumber',
      'paymentLine.id',
      'payment.id',
      'payment.documentSum',
      'payment.expectedDate',
    ]);

    const invoices = await invoicesQuery.getMany();

    invoices.forEach((invoice) => {
      invoice['orders'] = [
        ...new Set(
          invoice.invoiceLines.map((invoiceLine) => invoiceLine.order),
        ),
      ];

      invoice['payments'] = [
        ...new Set(
          invoice.paymentLines.map((paymentLine) => paymentLine.payment),
        ),
      ];
    });

    return invoices;
  }
}
