import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Batch, Package, Product, Service } from './entities';
import { TechnicalProcess } from '../libs/entities';
import {
  ProductionInLine,
  ProductionOutLine,
} from '../documents/production/entities';
import { InvoiceLine } from '../documents/invoices/entities';

import { GetBatchDataResponseDTO, GetProductDataResponseDTO } from './dto';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchesRepository: Repository<Batch>,
    @InjectRepository(Package)
    private readonly packagesRepository: Repository<Package>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

  async getBatchData(batchId: number): Promise<GetBatchDataResponseDTO> {
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

    const invoiceLines = await this.getInvoiceLinesByBatchIds(batchId);
    const productionOutLines =
      await this.getProductionOutLinesByBatchIds(batchId);
    const productionInLines =
      await this.getProductionInLinesByBatchIds(batchId);

    return { batch, invoiceLines, productionOutLines, productionInLines };
  }

  private async getInvoiceLinesByBatchIds(
    batchIds: number | number[],
  ): Promise<InvoiceLine[]> {
    const invoiceLines = await this.batchesRepository.manager.find(
      InvoiceLine,
      {
        where: {
          batch: { id: Array.isArray(batchIds) ? In(batchIds) : batchIds },
        },
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

  private async getProductionOutLinesByBatchIds(
    batchIds: number | number[],
  ): Promise<ProductionOutLine[]> {
    const productionOutLines = await this.batchesRepository.manager.find(
      ProductionOutLine,
      {
        where: {
          batch: { id: Array.isArray(batchIds) ? In(batchIds) : batchIds },
        },
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

  private async getProductionInLinesByBatchIds(
    batchIds: number | number[],
  ): Promise<ProductionInLine[]> {
    const productionInLines = await this.batchesRepository.manager.find(
      ProductionInLine,
      {
        where: {
          batch: { id: Array.isArray(batchIds) ? In(batchIds) : batchIds },
        },
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

  async getProductData(productId: number): Promise<GetProductDataResponseDTO> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['batches'],
      select: {
        id: true,
        name: true,
        batches: {
          id: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${productId} not found`);
    }

    const batchIds = product.batches.map((batch) => batch.id);

    const invoiceLines = await this.getInvoiceLinesByBatchIds(batchIds);
    const productionOutLines =
      await this.getProductionOutLinesByBatchIds(batchIds);
    const productionInLines =
      await this.getProductionInLinesByBatchIds(batchIds);

    return { product, invoiceLines, productionOutLines, productionInLines };
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

  async getBatchesStoreData() {
    return await this.batchesRepository
      .createQueryBuilder('batch')
      .select(['batch.id', 'batch.name', 'batch.productId'])
      .where('batch.isArchived = :archived', { archived: false })
      .getMany();
  }

  async getProductsStoreData() {
    return await this.productsRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.name'])
      .getMany();
  }

  async getPackagesStoreData() {
    return await this.packagesRepository
      .createQueryBuilder('package')
      .select(['package.id', 'package.name'])
      .getMany();
  }

  async getServicesStoreData() {
    return await this.servicesRepository
      .createQueryBuilder('service')
      .select(['service.id', 'service.name'])
      .getMany();
  }
}
