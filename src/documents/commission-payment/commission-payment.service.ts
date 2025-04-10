import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommissionPayment } from './entities';
import { Repository } from 'typeorm';
import { CreateCommissionPaymentDTO } from './dto';
import { LibsService } from '../../libs';

@Injectable()
export class CommissionPaymentService {
  constructor(
    @InjectRepository(CommissionPayment)
    private readonly commissionPaymentsRepository: Repository<CommissionPayment>,
    private readonly libsService: LibsService,
  ) {}

  async getCommisionPayments() {
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

  async getCommisionPaymentById(commissionPaymentId: number) {
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
      .getMany();

    return commissionPayment;
  }

  async createCommissionPayment(
    createCommissionPaymentDTO: CreateCommissionPaymentDTO,
  ) {
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
}
