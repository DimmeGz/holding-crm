import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CompaniesService } from '../../companies';
import { LibsService } from '../../libs';

import { CommissionPayment } from './entities';
import { CreateCommissionPaymentDTO, UpdateCommissionPaymentDTO } from './dto';

@Injectable()
export class CommissionPaymentService {
  constructor(
    @InjectRepository(CommissionPayment)
    private readonly commissionPaymentsRepository: Repository<CommissionPayment>,
    private readonly companiesService: CompaniesService,
    private readonly libsService: LibsService,
  ) {}

  private createBaseQueryBuilder(): SelectQueryBuilder<CommissionPayment> {
    return this.commissionPaymentsRepository
      .createQueryBuilder('commissionPayment')
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
        'commissionPaymentLine.id',
        'commissionPaymentLine.commissionInvoiceId',
        'commissionPaymentLine.amount',
      ]);
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
      } as CommissionPayment & { commissionLineIds: number[]; totalAmount: number };
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
    const { expectedDate, ...restDto } = createCommissionPaymentDTO;

    const newCommissionPayment =
      this.commissionPaymentsRepository.create(restDto);

    newCommissionPayment.expectedDate = expectedDate || new Date();
    newCommissionPayment.createdAt = new Date();
    newCommissionPayment.comment = newCommissionPayment.comment || '';
    newCommissionPayment.status = false;

    newCommissionPayment.technicalProcesses =
      await this.libsService.getTechnicalProcessesByCommissionInvoiceId(
        newCommissionPayment.commissionInvoiceId,
      );

    return await this.commissionPaymentsRepository.save(newCommissionPayment);
  }

  async updateCommissionPayment(
    commissionPaymentId: number,
    updateCommissionPaymentDTO: UpdateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository.findOneBy(
      {
        id: commissionPaymentId,
        status: false,
      },
    );

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with id: ${commissionPaymentId} and status: false not found`,
      );
    }

    Object.assign(commissionPayment, updateCommissionPaymentDTO);

    return await this.commissionPaymentsRepository.save(commissionPayment);
  }

  async removeCommissionPayment(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository.findOneBy(
      {
        id: commissionPaymentId,
        status: false,
      },
    );

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
    const commissionPayment = await this.commissionPaymentsRepository.findOneBy(
      {
        id: commissionPaymentId,
      },
    );

    if (!commissionPayment) {
      throw new NotFoundException(
        `Commission Payment with id: ${commissionPaymentId} not found`,
      );
    }

    commissionPayment.status = !commissionPayment.status;

    // TODO: change amount by lines
    // await this.companiesService.changeAccountsBalances({
    //   sellerId: commissionPayment.sellerId,
    //   buyerId: commissionPayment.buyerId,
    //   currencyId: commissionPayment.currencyId,
    //   status: commissionPayment.status,
    //   amount: commissionPayment.amount,
    // });

    return await this.commissionPaymentsRepository.save(commissionPayment);
  }
}
