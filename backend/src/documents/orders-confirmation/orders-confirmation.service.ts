import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { GoodsService } from '../../goods';
import { Order } from '../orders/entities';

import { OrderConfirmation, OrderConfirmationLine } from './entities';

import {
  CreateOrderConfirmationDTO,
  CreateOrderConfirmationLineDTO,
  UpdateOrderConfirmationDTO,
  UpdateOrderConfirmationLineDTO,
} from './dto';

@Injectable()
export class OrdersConfirmationService {
  constructor(
    @InjectRepository(OrderConfirmation)
    private readonly orderConfirmationsRepository: Repository<OrderConfirmation>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly goodsService: GoodsService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<OrderConfirmation> {
    return this.orderConfirmationsRepository.createQueryBuilder(
      'orderConfirmation',
    );
  }

  private applyBaseSelect(
    qb: SelectQueryBuilder<OrderConfirmation>,
  ): SelectQueryBuilder<OrderConfirmation> {
    return qb.select([
      'orderConfirmation.id',
      'orderConfirmation.confirmationNumber',
    ]);
  }

  async getConfirmationsByOrderId(
    orderId: number,
  ): Promise<OrderConfirmation[]> {
    return await this.applyBaseSelect(this.createBaseQueryBuilder())
      .where('orderConfirmation.orderId = :orderId', { orderId })
      .getMany();
  }

  async getOrderConfirmationById(
    confirmationId: number,
  ): Promise<OrderConfirmation> {
    const confirmation = await this.createBaseQueryBuilder()
      .where('orderConfirmation.id = :confirmationId', { confirmationId })
      .leftJoinAndSelect('orderConfirmation.orderLines', 'orderLines')
      .leftJoinAndSelect('orderConfirmation.incoterms', 'incoterms')
      .getOne();

    if (!confirmation) {
      throw new NotFoundException(
        `Order confirmation with id: ${confirmationId} not found`,
      );
    }

    return confirmation;
  }

  async createOrderConfirmation(
    createOrderConfirmationDTO: CreateOrderConfirmationDTO,
  ): Promise<OrderConfirmation> {
    const order = await this.ordersRepository.findOne({
      where: { id: createOrderConfirmationDTO.orderId },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id: ${createOrderConfirmationDTO.orderId} not found`,
      );
    }

    if (order.status) {
      throw new BadRequestException(
        `Cannot create confirmation for closed order with id: ${order.id}`,
      );
    }

    const technicalProcesses = await this.getTechnicalProcesses(
      createOrderConfirmationDTO.orderLines,
    );

    const orderConfirmation = this.orderConfirmationsRepository.create({
      ...createOrderConfirmationDTO,
      createdAt: new Date(),
      createdById: 1,
      comment: createOrderConfirmationDTO.comment || '',
      paymentDelay: createOrderConfirmationDTO.paymentDelay || 0,
      transportPlace: createOrderConfirmationDTO.transportPlace || '',
      technicalProcesses,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saved = await queryRunner.manager.save(orderConfirmation);
      await this.applyOrderSideEffects(
        queryRunner.manager,
        order.id,
        createOrderConfirmationDTO.expectedDate,
        createOrderConfirmationDTO.orderLines,
      );
      await queryRunner.commitTransaction();
      return saved;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to create order confirmation';
      throw new BadRequestException(message);
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderConfirmation(
    confirmationId: number,
    updateOrderConfirmationDTO: UpdateOrderConfirmationDTO,
  ): Promise<OrderConfirmation> {
    const confirmation = await this.createBaseQueryBuilder()
      .where('orderConfirmation.id = :confirmationId', { confirmationId })
      .leftJoinAndSelect('orderConfirmation.orderLines', 'orderLines')
      .leftJoinAndSelect(
        'orderConfirmation.technicalProcesses',
        'technicalProcesses',
      )
      .getOne();

    if (!confirmation) {
      throw new NotFoundException(
        `Order confirmation with id: ${confirmationId} not found`,
      );
    }

    const order = await this.ordersRepository.findOne({
      where: { id: confirmation.orderId },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with id: ${confirmation.orderId} not found`,
      );
    }

    if (order.status) {
      throw new BadRequestException(
        `Cannot update confirmation for closed order with id: ${order.id}`,
      );
    }

    const orderLines = updateOrderConfirmationDTO.orderLines ?? [];
    const updatedOrderLinesIds = orderLines
      .filter((line) => line['id'])
      .map((line) => line['id'] as number);
    const orderLinesToDelete = (confirmation.orderLines || []).filter(
      (line) => line.id && !updatedOrderLinesIds.includes(line.id),
    );

    const updated = Object.assign(confirmation, {
      buyerWarehouseId: updateOrderConfirmationDTO.buyerWarehouseId,
      recipientId: updateOrderConfirmationDTO.recipientId ?? null,
      recipientWarehouseId:
        updateOrderConfirmationDTO.recipientWarehouseId ?? null,
      paymentDelay: updateOrderConfirmationDTO.paymentDelay || 0,
      confirmationNumber: updateOrderConfirmationDTO.confirmationNumber,
      expectedDate: updateOrderConfirmationDTO.expectedDate,
      incotermsId: updateOrderConfirmationDTO.incotermsId,
      transportPlace: updateOrderConfirmationDTO.transportPlace || '',
      comment: updateOrderConfirmationDTO.comment || '',
      orderLines,
      technicalProcesses: await this.getTechnicalProcesses(orderLines),
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (orderLinesToDelete.length) {
        await queryRunner.manager.remove(
          orderLinesToDelete as OrderConfirmationLine[],
        );
      }

      const saved = await queryRunner.manager.save(updated);
      await this.applyOrderSideEffects(
        queryRunner.manager,
        order.id,
        updateOrderConfirmationDTO.expectedDate,
        orderLines,
      );
      await queryRunner.commitTransaction();
      return saved;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      const message =
        e instanceof Error
          ? e.message
          : 'Failed to update order confirmation';
      throw new BadRequestException(message);
    } finally {
      await queryRunner.release();
    }
  }

  private calculateDocumentSum(
    orderLines: (
      | CreateOrderConfirmationLineDTO
      | UpdateOrderConfirmationLineDTO
    )[],
  ): number {
    return orderLines.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  }

  private async getTechnicalProcesses(
    orderLines: (
      | CreateOrderConfirmationLineDTO
      | UpdateOrderConfirmationLineDTO
    )[],
  ): Promise<{ id: number }[]> {
    const productIds = [
      ...new Set(orderLines.map((line) => line.productManId)),
    ];
    const processes =
      await this.goodsService.getTechnicalProcessesFromProductIds(productIds);

    return [...processes].map((process) => ({ id: process.id! }));
  }

  /**
   * Django parity: overwrites Order.documentSum with confirmation product lines
   * only (service lines from the order are not included).
   */
  private async applyOrderSideEffects(
    manager: EntityManager,
    orderId: number,
    expectedDate: Date,
    orderLines: (
      | CreateOrderConfirmationLineDTO
      | UpdateOrderConfirmationLineDTO
    )[],
  ): Promise<void> {
    await manager.update(Order, orderId, {
      documentSum: this.calculateDocumentSum(orderLines),
      confirmExpectedDate: expectedDate,
      sortingDate: expectedDate,
    });
  }
}
