import { Repository } from 'typeorm';
import { Batch, Product, Service } from './entities';
import { TechnicalProcess } from '../libs/entities';
import { GetBatchDataResponseDTO, GetProductDataResponseDTO } from './dto';
export declare class GoodsService {
    private readonly batchesRepository;
    private readonly productsRepository;
    private readonly servicesRepository;
    constructor(batchesRepository: Repository<Batch>, productsRepository: Repository<Product>, servicesRepository: Repository<Service>);
    getBatchData(batchId: number): Promise<GetBatchDataResponseDTO>;
    private getInvoiceLinesByBatchIds;
    private getProductionOutLinesByBatchIds;
    private getProductionInLinesByBatchIds;
    getProductData(productId: number): Promise<GetProductDataResponseDTO>;
    getTechnicalProcessesFromProductIds(productIds: number[]): Promise<Set<Partial<TechnicalProcess>>>;
    getTechnicalProcessesFromServiceIds(serviceIds: number[]): Promise<Set<Partial<TechnicalProcess>>>;
}
