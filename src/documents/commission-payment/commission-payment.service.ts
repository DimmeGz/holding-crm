import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async getCommisionPayments(): Promise<CommissionPayment[]> {
    const commissionPayments = await this.commissionPaymentsRepository
      .createQueryBuilder('commissionPayment')
      .leftJoin('commissionPayment.seller', 'seller')
      .leftJoin('commissionPayment.buyer', 'buyer')
      .leftJoin('commissionPayment.commissionInvoice', 'commissionInvoice')
      .leftJoin('commissionPayment.currency', 'currency')
      .select([
        'commissionPayment.id',
        'commissionPayment.status',
        'commissionPayment.amount',
        'commissionPayment.expectedDate',
        'seller.name',
        'buyer.name',
        'commissionInvoice.id',
        'currency.name',
      ])
      .orderBy('commissionPayment.id', 'DESC')
      .getMany();

    return commissionPayments;
  }

  async getCommisionPaymentById(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository
      .createQueryBuilder('commissionPayment')
      .leftJoin('commissionPayment.seller', 'seller')
      .leftJoin('commissionPayment.buyer', 'buyer')
      .leftJoin('commissionPayment.commissionInvoice', 'commissionInvoice')
      .leftJoin('commissionPayment.currency', 'currency')
      .select([
        'commissionPayment.id',
        'commissionPayment.status',
        'commissionPayment.amount',
        'commissionPayment.expectedDate',
        'seller.name',
        'buyer.name',
        'commissionInvoice.id',
        'currency.name',
      ])
      .where('commissionPayment.id = :commissionPaymentId', {
        commissionPaymentId,
      })
      .getOne();

    return commissionPayment;
  }

  async createCommissionPayment(
    createCommissionPaymentDTO: CreateCommissionPaymentDTO,
  ): Promise<CommissionPayment> {
    createCommissionPaymentDTO.expectedDate =
      createCommissionPaymentDTO.expectedDate || new Date();
    const newCommissionPayment = new CommissionPayment(
      createCommissionPaymentDTO,
    );

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
      { id: commissionPaymentId, status: false },
    );

    const updated = Object.assign(
      commissionPayment,
      updateCommissionPaymentDTO,
    );

    return await this.commissionPaymentsRepository.save(updated);
  }

  async removeCommissionPayment(commissionPaymentId: number) {
    try {
      const commissionPayment =
        await this.commissionPaymentsRepository.findOneByOrFail({
          id: commissionPaymentId,
          status: false,
        });

      return await this.commissionPaymentsRepository.remove(commissionPayment);
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async changeCommissionPaymentStatus(
    commissionPaymentId: number,
  ): Promise<CommissionPayment> {
    const commissionPayment = await this.commissionPaymentsRepository.findOneBy(
      { id: commissionPaymentId },
    );

    commissionPayment.status = !commissionPayment.status;

    await this.companiesService.changeAccountsBalances({
      sellerId: commissionPayment.sellerId,
      buyerId: commissionPayment.buyerId,
      currencyId: commissionPayment.currencyId,
      status: commissionPayment.status,
      amount: commissionPayment.amount,
    });

    return await this.commissionPaymentsRepository.save(commissionPayment);
  }
}
