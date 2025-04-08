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
    if (productIds.length) {
      const products = await this.productsRepository
        .createQueryBuilder('product')
        .leftJoin('product.technicalProcesses', 'technicalProcess')
        .where('product.id IN (:...productIds)', { productIds })
        .select(['product.id', 'technicalProcess.id'])
        .getMany();

      const processes = [];
      for (const product of products) {
        processes.push([...product.technicalProcesses]);
      }
      return new Set(...processes);
    } else {
      return new Set();
    }
  }

  async getTechnicalProcessesFromServiceIds(
    serviceIds: number[],
  ): Promise<Set<Partial<TechnicalProcess>>> {
    if (serviceIds.length) {
      const services = await this.servicesRepository
        .createQueryBuilder('service')
        .leftJoin('service.technicalProcesses', 'technicalProcess')
        .where('service.id IN (:...serviceIds)', { serviceIds })
        .select(['service.id', 'technicalProcess.id'])
        .getMany();

      const processes = [];
      for (const service of services) {
        processes.push([...service.technicalProcesses]);
      }

      return new Set(...processes);
    } else {
      return new Set();
    }
  }
}
