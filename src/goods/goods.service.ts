import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Batch, Product, Service } from './entities';
import { TechnicalProcess } from '../libs/entities';
import {
  ProductionInLine,
  ProductionOutLine,
} from '../documents/production/entities';
import { InvoiceLine } from '../documents/invoice/entities';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async getBatchData(batchId: number) {
    const batch = await this.batchesRepository.findOne({
      where: { id: batchId },
      relations: ['product'],
      select: {
        id: true,
        name: true,
        product: {
          id: true,
          name: true,
        },
      },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with id: ${batchId} not found`);
    }

    const invoiceLines = await this.getBatchInvoiceLines(batchId);
    const productionOutLines = await this.getBatchProductionOutLines(batchId);
    const productionInLines = await this.getBatchProductionInLines(batchId);

    return { batch, invoiceLines, productionOutLines, productionInLines };
  }

  private async getBatchInvoiceLines(batchId: number): Promise<InvoiceLine[]> {
    const invoiceLines = await this.batchesRepository.manager.find(
      InvoiceLine,
      {
        where: { batch: { id: batchId } },
        relations: ['invoice', 'invoice.seller', 'invoice.buyer'],
        select: {
          id: true,
          qty: true,
          price: true,
          invoice: {
            id: true,
            status: true,
            invoiceNumber: true,
            expectedDate: true,
            seller: {
              id: true,
              name: true,
            },
            buyer: {
              id: true,
              name: true,
            },
          },
        },
      },
    );

    return invoiceLines;
  }

  private async getBatchProductionOutLines(
    batchId: number,
  ): Promise<ProductionOutLine[]> {
    const productionOutLines = await this.batchesRepository.manager.find(
      ProductionOutLine,
      {
        where: { batch: { id: batchId } },
        relations: ['production', 'production.company'],
        select: {
          id: true,
          qty: true,
          production: {
            id: true,
            status: true,
            expectedDate: true,
            company: {
              id: true,
              name: true,
            },
          },
        },
      },
    );

    return productionOutLines;
  }

  private async getBatchProductionInLines(
    batchId: number,
  ): Promise<ProductionInLine[]> {
    const productionInLines = await this.batchesRepository.manager.find(
      ProductionInLine,
      {
        where: { batch: { id: batchId } },
        relations: ['production', 'production.company'],
        select: {
          id: true,
          qty: true,
          production: {
            id: true,
            status: true,
            expectedDate: true,
            company: {
              id: true,
              name: true,
            },
          },
        },
      },
    );

    return productionInLines;
  }

  async getTechnicalProcessesFromProductIds(
    productIds: number[],
  ): Promise<Set<Partial<TechnicalProcess>>> {
    if (productIds.length === 0) {
      return new Set();
    }
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.technicalProcesses', 'technicalProcess')
      .where('product.id IN (:...productIds)', { productIds })
      .select(['product.id', 'technicalProcess.id'])
      .getMany();

    const processes = new Set<Partial<TechnicalProcess>>();
    for (const product of products) {
      if (product.technicalProcesses) {
        product.technicalProcesses.forEach((process) => processes.add(process));
      }
    }
    return processes;
  }

  async getTechnicalProcessesFromServiceIds(
    serviceIds: number[],
  ): Promise<Set<Partial<TechnicalProcess>>> {
    if (serviceIds.length === 0) {
      return new Set();
    }
    const services = await this.servicesRepository
      .createQueryBuilder('service')
      .leftJoin('service.technicalProcesses', 'technicalProcess')
      .where('service.id IN (:...serviceIds)', { serviceIds })
      .select(['service.id', 'technicalProcess.id'])
      .getMany();

    const processes = new Set<Partial<TechnicalProcess>>();
    for (const service of services) {
      if (service.technicalProcesses) {
        service.technicalProcesses.forEach((process) => processes.add(process));
      }
    }

    return processes;
  }
}
