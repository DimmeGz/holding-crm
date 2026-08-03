import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import {
  buildProductSummary,
  getMonthRange,
  isCurrentMonth,
  resolveCalendarHex,
  resolveEffectiveDate,
  toDateString,
  todayDateString,
} from './calendar.utils';
import { CalendarOrderDTO, GetCalendarQueryDTO } from './dto';

import { CompanyType } from '../companies/enums';
import { DocumentTypeEnum } from '../documents/common/enums';
import { InvoiceLine } from '../documents/invoices/entities';
import { Order, OrderLine } from '../documents/orders/entities';

type OrderWithParties = Order & {
  seller: {
    id: number;
    name: string;
    companyType: CompanyType;
    calendarHex?: string | null;
  };
  buyer: {
    id: number;
    name: string;
    companyType: CompanyType;
    calendarHex?: string | null;
  };
};

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLineRepository: Repository<OrderLine>,
    @InjectRepository(InvoiceLine)
    private readonly invoiceLineRepository: Repository<InvoiceLine>,
  ) {}

  async getCalendarOrders(
    query: GetCalendarQueryDTO = {},
  ): Promise<CalendarOrderDTO[]> {
    const now = new Date();
    const year = query.year ?? now.getFullYear();
    const month = query.month ?? now.getMonth() + 1;
    const { start, end } = getMonthRange(year, month);

    const regularOrders = await this.loadRegularOrders(start, end, query);
    const closedAsapOrders = await this.loadClosedAsapOrders(start, end, query);

    const byId = new Map<number, { order: OrderWithParties; displayDate: string; isAsap: boolean }>();

    for (const order of regularOrders) {
      const displayDate = resolveEffectiveDate(
        order.confirmExpectedDate,
        order.expectedDate,
      );
      if (!displayDate) {
        continue;
      }
      byId.set(order.id, {
        order: order as OrderWithParties,
        displayDate,
        isAsap: false,
      });
    }

    for (const order of closedAsapOrders) {
      const displayDate = toDateString(order.signatureDate);
      if (!displayDate) {
        continue;
      }
      // Closed ASAP is shown on signatureDate (overrides expectedDate placement).
      byId.set(order.id, {
        order: order as OrderWithParties,
        displayDate,
        isAsap: false,
      });
    }

    if (isCurrentMonth(year, month, now)) {
      const openAsapOrders = await this.loadOpenAsapOrders(query);
      const today = todayDateString(now);
      for (const order of openAsapOrders) {
        // Open ASAP always lands on today (overrides expectedDate placement).
        byId.set(order.id, {
          order: order as OrderWithParties,
          displayDate: today,
          isAsap: true,
        });
      }
    }

    const entries = [...byId.values()];
    if (!entries.length) {
      return [];
    }

    const orderIds = entries.map((entry) => entry.order.id);
    const [linesByOrderId, invoiceOrderIds] = await Promise.all([
      this.loadLinesByOrderId(orderIds),
      this.loadOrdersWithInvoices(orderIds),
    ]);

    return entries
      .map(({ order, displayDate, isAsap }) => {
        const { productSummary, tooltipLines } = buildProductSummary(
          linesByOrderId.get(order.id) ?? [],
        );

        return {
          id: order.id,
          orderNumber: order.orderNumber,
          displayDate,
          status: order.status,
          hasInvoices: invoiceOrderIds.has(order.id),
          seller: { id: order.seller.id, name: order.seller.name },
          buyer: { id: order.buyer.id, name: order.buyer.name },
          calendarHex: resolveCalendarHex(order.seller, order.buyer),
          productSummary,
          tooltipLines,
          isAsap,
        };
      })
      .sort((a, b) => {
        if (a.displayDate !== b.displayDate) {
          return a.displayDate.localeCompare(b.displayDate);
        }
        return a.orderNumber.localeCompare(b.orderNumber);
      });
  }

  private createBaseQueryBuilder(
    query: GetCalendarQueryDTO,
  ): SelectQueryBuilder<Order> {
    const qb = this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.seller', 'seller')
      .innerJoin('order.buyer', 'buyer')
      .select([
        'order.id',
        'order.orderNumber',
        'order.status',
        'order.expectedDate',
        'order.confirmExpectedDate',
        'order.signatureDate',
        'order.isDateAsap',
        'order.isHidden',
        'seller.id',
        'seller.name',
        'seller.companyType',
        'seller.calendarHex',
        'buyer.id',
        'buyer.name',
        'buyer.companyType',
        'buyer.calendarHex',
      ])
      .where('order.isHidden = :isHidden', { isHidden: false })
      // Always require at least one technical process (Django parity).
      .innerJoin('order.technicalProcesses', 'technicalProcess');

    if (query.process?.length) {
      qb.andWhere('technicalProcess.id IN (:...processIds)', {
        processIds: query.process,
      });
    }

    if (query.type === DocumentTypeEnum.SELLER) {
      qb.andWhere('seller.companyType = :companyType', {
        companyType: CompanyType.INNER_COMPANY,
      });
    } else if (query.type === DocumentTypeEnum.BUYER) {
      qb.andWhere('buyer.companyType = :companyType', {
        companyType: CompanyType.INNER_COMPANY,
      });
    }

    return qb;
  }

  private async loadRegularOrders(
    start: string,
    end: string,
    query: GetCalendarQueryDTO,
  ): Promise<Order[]> {
    return this.createBaseQueryBuilder(query)
      .andWhere(
        `(
          (order.confirmExpectedDate IS NOT NULL AND order.confirmExpectedDate BETWEEN :start AND :end)
          OR
          (order.confirmExpectedDate IS NULL AND order.expectedDate BETWEEN :start AND :end)
        )`,
        { start, end },
      )
      .distinct(true)
      .getMany();
  }

  private async loadClosedAsapOrders(
    start: string,
    end: string,
    query: GetCalendarQueryDTO,
  ): Promise<Order[]> {
    return this.createBaseQueryBuilder(query)
      .andWhere('order.confirmExpectedDate IS NULL')
      .andWhere('order.isDateAsap = :isDateAsap', { isDateAsap: true })
      .andWhere('order.status = :status', { status: true })
      .andWhere('order.signatureDate BETWEEN :start AND :end', { start, end })
      .distinct(true)
      .getMany();
  }

  private async loadOpenAsapOrders(
    query: GetCalendarQueryDTO,
  ): Promise<Order[]> {
    return this.createBaseQueryBuilder(query)
      .andWhere('order.confirmExpectedDate IS NULL')
      .andWhere('order.isDateAsap = :isDateAsap', { isDateAsap: true })
      .andWhere('order.status = :status', { status: false })
      .distinct(true)
      .getMany();
  }

  private async loadLinesByOrderId(
    orderIds: number[],
  ): Promise<Map<number, OrderLine[]>> {
    const lines = await this.orderLineRepository
      .createQueryBuilder('ol')
      .innerJoinAndSelect('ol.order', 'order')
      .leftJoinAndSelect('ol.productBuy', 'productBuy')
      .where('order.id IN (:...orderIds)', { orderIds })
      .select(['ol.id', 'ol.qty', 'order.id', 'productBuy.id', 'productBuy.name'])
      .getMany();

    const map = new Map<number, OrderLine[]>();
    for (const line of lines) {
      const orderId = line.order?.id;
      if (!orderId) {
        continue;
      }
      const list = map.get(orderId) ?? [];
      list.push(line);
      map.set(orderId, list);
    }

    return map;
  }

  private async loadOrdersWithInvoices(
    orderIds: number[],
  ): Promise<Set<number>> {
    const rows = await this.invoiceLineRepository
      .createQueryBuilder('il')
      .select('DISTINCT il.orderId', 'orderId')
      .where('il.orderId IN (:...orderIds)', { orderIds })
      .getRawMany<{ orderId: number | string }>();

    return new Set(
      rows
        .map((row) => Number(row.orderId))
        .filter((id) => Number.isFinite(id)),
    );
  }
}
