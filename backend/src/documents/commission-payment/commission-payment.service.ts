import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { LibsService } from '../../libs';
import { CommissionInvoiceService } from '../commission-invoice';

import { CommissionPayment, CommissionPaymentLine } from './entities';
import {
  CreateCommissionPaymentDTO,
  UpdateCommissionPaymentDTO,
} from './dto';

@Injectable()
export class CommissionPaymentService {
  constructor(
    @InjectRepository(CommissionPayment)
    private readonly commissionPaymentsRepository: Repository<CommissionPayment>,
    @InjectDataSource() private dataSource: DataSource,
    private readonly companiesService: CompaniesService,
    private readonly libsService: LibsService,
    @Inject(forwardRef(() => CommissionInvoiceService))
    private readonly commissionInvoiceService: CommissionInvoiceService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<CommissionPayment> {
    return this.commissionPaymentsRepository.createQueryBuilder(
      'commissionPayment',
    );
  }

  private applyBaseSelect(
    qb: SelectQueryBuilder<CommissionPayment>,
  ): SelectQueryBuilder<CommissionPayment> {
    return qb
      .leftJoin(
        'commissionPayment.commissionPaymentLines',
        'commissionPaymentLine',
      )
      .select([
        'commissionPayment.id',
        'commissionPayment.sellerId',
        'commissionPayment.buyerId',
        'commissionPayment.status',
        'commissionPayment.expectedDate',
        'commissionPayment.currencyId',
        'commissionPayment.comment',
        'commissionPaymentLine.id',
        'commissionPaymentLine.commissionInvoiceId',
        'commissionPaymentLine.amount',
      ]);
  }

  private extractLinesData(
    commissionPaymentLines: Partial<CommissionPaymentLine>[],
  ): { commissionInvoiceIds: number[]; totalAmount: number } {
    return commissionPaymentLines.reduce(
      (acc, cur) => {
        if (cur.commissionInvoiceId) {
          acc.commissionInvoiceIds.push(cur.commissionInvoiceId);
        }
        acc.totalAmount += Number(cur.amount) || 0;
        return acc;
      },
      { commissionInvoiceIds: [] as number[], totalAmount: 0 },
    );
  }

  async getCommisionPayments(): Promise<CommissionPayment[]> {
    const qb = this.createBaseQueryBuilder();

    this.applyBaseSelect(qb);

    const payments = await qb
      .orderBy('commissionPayment.id', 'DESC')
      .getMany();

    return payments.map((payment) => {
      const totalAmount =
        payment.commissionPaymentLines?.reduce((acc, line) => {
          return acc + ((line as { amount: number }).amount || 0);
        }, 0) ?? 0;

      return {
        ...payment,
        totalAmount,
      } as CommissionPayment & { totalAmount: number };
    });
  }

  async getCommisionPaymentById(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const qb = this.createBaseQueryBuilder();

    this.applyBaseSelect(qb);

    const commissionPayment = await qb
      .where('commissionPayment.id = :commissionPaymentId', {
        commissionPaymentId,
      })
      .getOne();

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with ID ${commissionPaymentId} not found`,
      );
    }

    return commissionPayment;
  }

  async createCommissionPayment(
    createCommissionPaymentDTO: CreateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    const newCommissionPayment = this.commissionPaymentsRepository.create(
      createCommissionPaymentDTO,
    );

    newCommissionPayment.expectedDate =
      createCommissionPaymentDTO.expectedDate || new Date();
    newCommissionPayment.createdAt = new Date();
    newCommissionPayment.comment = newCommissionPayment.comment || '';
    newCommissionPayment.status = false;

    const { commissionInvoiceIds } = this.extractLinesData(
      newCommissionPayment.commissionPaymentLines,
    );

    // Legacy header FK: sync from first line (column remains, no drop)
    newCommissionPayment.commissionInvoiceId = commissionInvoiceIds[0];

    newCommissionPayment.technicalProcesses =
      await this.libsService.getTechnicalProcessesByCommissionInvoiceIds(
        commissionInvoiceIds,
      );

    return await this.commissionPaymentsRepository.save(newCommissionPayment);
  }

  async updateCommissionPayment(
    commissionPaymentId: number,
    updateCommissionPaymentDTO: UpdateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.createBaseQueryBuilder()
      .where('commissionPayment.id = :commissionPaymentId', {
        commissionPaymentId,
      })
      .andWhere('commissionPayment.status = false')
      .leftJoinAndSelect(
        'commissionPayment.commissionPaymentLines',
        'commissionPaymentLine',
      )
      .getOne();

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with id: ${commissionPaymentId} and status: false not found`,
      );
    }

    const commissionPaymentLines =
      updateCommissionPaymentDTO.commissionPaymentLines ?? [];
    const updatedLineIds = commissionPaymentLines
      .filter((line) => line['id'])
      .map((line) => line['id']);
    const linesToDelete = commissionPayment.commissionPaymentLines.filter(
      (line) => !updatedLineIds.includes(line.id),
    );

    const updated = Object.assign(commissionPayment, {
      ...updateCommissionPaymentDTO,
      commissionPaymentLines,
    });

    const { commissionInvoiceIds } = this.extractLinesData(
      updated.commissionPaymentLines,
    );
    updated.commissionInvoiceId = commissionInvoiceIds[0];
    updated.technicalProcesses =
      await this.libsService.getTechnicalProcessesByCommissionInvoiceIds(
        commissionInvoiceIds,
      );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (linesToDelete.length) {
        await queryRunner.manager.remove(linesToDelete);
      }

      await queryRunner.manager.save(updated);

      await queryRunner.commitTransaction();

      return updated;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException();
    } finally {
      await queryRunner.release();
    }
  }

  async removeCommissionPayment(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository.findOne({
      where: { id: commissionPaymentId, status: false },
      relations: ['commissionPaymentLines'],
    });

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with id: ${commissionPaymentId} and status: false not found`,
      );
    }

    return await this.commissionPaymentsRepository.remove(commissionPayment);
  }

  async changeCommissionPaymentStatus(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository.findOne({
      where: { id: commissionPaymentId },
      relations: ['commissionPaymentLines'],
    });

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with id: ${commissionPaymentId} not found`,
      );
    }

    commissionPayment.status = !commissionPayment.status;

    const { totalAmount } = this.extractLinesData(
      commissionPayment.commissionPaymentLines,
    );

    await this.companiesService.changeAccountsBalances({
      sellerId: commissionPayment.sellerId,
      buyerId: commissionPayment.buyerId,
      currencyId: commissionPayment.currencyId,
      status: commissionPayment.status,
      amount: totalAmount,
    });

    await this.commissionInvoiceService.changeCommissionPaymentBalance({
      status: commissionPayment.status,
      commissionPaymentLines: commissionPayment.commissionPaymentLines,
    });

    return await this.commissionPaymentsRepository.save(commissionPayment);
  }
}
