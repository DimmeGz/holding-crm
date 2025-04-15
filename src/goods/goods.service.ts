import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product, Service } from './entities';
import { TechnicalProcess } from '../libs/entities';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
  ) {}

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
