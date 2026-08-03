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
import { Shipment } from '../documents/shipment/entities';
import { Receive } from '../documents/receive/entities';

import { GetBatchDataResponseDTO, GetProductDataResponseDTO } from './dto';
import type { ReportShipment, ReportShipmentReceive } from './types';

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

    const invoiceLines = await this.getInvoiceLines({ batchId });
    const productionOutLines = await this.getProductionOutLines({ batchId });
    const productionInLines = await this.getProductionInLines({ batchId });

    return { batch, invoiceLines, productionOutLines, productionInLines };
  }

  async getProductData(productId: number): Promise<GetProductDataResponseDTO> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id: ${productId} not found`);
    }

    const invoiceLines = await this.getInvoiceLines({ productId });
    const productionOutLines = await this.getProductionOutLines({ productId });
    const productionInLines = await this.getProductionInLines({ productId });

    return { product, invoiceLines, productionOutLines, productionInLines };
  }

  private async getInvoiceLines(filter: {
    productId?: number;
    batchId?: number;
  }): Promise<InvoiceLine[]> {
    const where = filter.productId
      ? { product: { id: filter.productId } }
      : { batch: { id: filter.batchId } };

    const invoiceLines = await this.batchesRepository.manager.find(InvoiceLine, {
      where,
      relations: ['product', 'batch', 'invoice', 'invoice.seller', 'invoice.buyer'],
      select: {
        id: true,
        qty: true,
        price: true,
        product: {
          id: true,
          name: true,
        },
        batch: {
          id: true,
          name: true,
        },
        invoice: {
          id: true,
          status: true,
          invoiceNumber: true,
          expectedDate: true,
          currencyId: true,
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
      order: {
        invoice: {
          expectedDate: 'DESC',
        },
      },
    });

    await this.attachShipmentsToInvoiceLines(invoiceLines);

    return invoiceLines;
  }

  private async attachShipmentsToInvoiceLines(
    invoiceLines: InvoiceLine[],
  ): Promise<void> {
    const invoiceIds = [
      ...new Set(
        invoiceLines
          .map((line) => line.invoice?.id)
          .filter((id): id is number => Boolean(id)),
      ),
    ];

    if (!invoiceIds.length) {
      return;
    }

    const shipments = await this.batchesRepository.manager.find(Shipment, {
      where: { invoiceId: In(invoiceIds) },
      select: {
        id: true,
        status: true,
        invoiceId: true,
      },
      order: { id: 'ASC' },
    });

    const shipmentIds = shipments.map((shipment) => shipment.id);
    const receives = shipmentIds.length
      ? await this.batchesRepository.manager.find(Receive, {
          where: { shipmentId: In(shipmentIds) },
          select: {
            id: true,
            status: true,
            shipmentId: true,
          },
          order: { id: 'ASC' },
        })
      : [];

    const receivesByShipmentId = new Map<number, ReportShipmentReceive[]>();
    for (const receive of receives) {
      const list = receivesByShipmentId.get(receive.shipmentId) ?? [];
      list.push({ id: receive.id, status: receive.status });
      receivesByShipmentId.set(receive.shipmentId, list);
    }

    const shipmentsByInvoiceId = new Map<number, ReportShipment[]>();
    for (const shipment of shipments) {
      const list = shipmentsByInvoiceId.get(shipment.invoiceId) ?? [];
      list.push({
        id: shipment.id,
        status: shipment.status,
        receives: receivesByShipmentId.get(shipment.id) ?? [],
      });
      shipmentsByInvoiceId.set(shipment.invoiceId, list);
    }

    for (const line of invoiceLines) {
      if (!line.invoice) {
        continue;
      }

      line.invoice.shipments = (shipmentsByInvoiceId.get(line.invoice.id) ??
        []) as Partial<Shipment>[];
    }
  }

  private async getProductionOutLines(filter: {
    productId?: number;
    batchId?: number;
  }): Promise<ProductionOutLine[]> {
    const where = filter.productId
      ? { product: { id: filter.productId } }
      : { batch: { id: filter.batchId } };

    return this.batchesRepository.manager.find(ProductionOutLine, {
      where,
      relations: ['product', 'batch', 'production', 'production.company'],
      select: {
        id: true,
        qty: true,
        product: {
          id: true,
          name: true,
        },
        batch: {
          id: true,
          name: true,
        },
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
      order: {
        production: {
          expectedDate: 'DESC',
        },
      },
    });
  }

  private async getProductionInLines(filter: {
    productId?: number;
    batchId?: number;
  }): Promise<ProductionInLine[]> {
    const where = filter.productId
      ? { product: { id: filter.productId } }
      : { batch: { id: filter.batchId } };

    return this.batchesRepository.manager.find(ProductionInLine, {
      where,
      relations: ['product', 'batch', 'production', 'production.company'],
      select: {
        id: true,
        qty: true,
        product: {
          id: true,
          name: true,
        },
        batch: {
          id: true,
          name: true,
        },
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
      order: {
        production: {
          expectedDate: 'DESC',
        },
      },
    });
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
