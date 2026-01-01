import { DataSource, Repository } from 'typeorm';
import { LibsService } from '../../libs';
import { WarehouseService } from '../../warehouse';
import { ProductTransport } from './entities';
import { CreateProductTransportDTO, UpdateProductTransportDTO } from './dto';
export declare class ProductTransportService {
    private readonly productTransportRepository;
    private dataSource;
    private readonly libsService;
    private readonly warehouseService;
    constructor(productTransportRepository: Repository<ProductTransport>, dataSource: DataSource, libsService: LibsService, warehouseService: WarehouseService);
    private createBaseQueryBuilder;
    private applyProductTransportListSelect;
    private applyProductTransportDetailSelect;
    getProductTransports(): Promise<ProductTransport[]>;
    getProductTransportById(productTransportId: number): Promise<ProductTransport>;
    createProductTransport(createTransportDTO: CreateProductTransportDTO): Promise<ProductTransport>;
    updateProductTransport(productTransportId: number, updateTransportDTO: UpdateProductTransportDTO): Promise<ProductTransport>;
    removeProductTransport(productTransportId: number): Promise<ProductTransport>;
    changeProductTransportStatus(productTransportId: number): Promise<ProductTransport>;
    private updateWarehouseAccounting;
}
