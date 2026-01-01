import { ProductTransportService } from './product-transport.service';
import { ProductTransport } from './entities';
import { CreateProductTransportDTO, UpdateProductTransportDTO } from './dto';
export declare class ProductTransportController {
    private readonly productTransportService;
    constructor(productTransportService: ProductTransportService);
    getProductTransports(): Promise<ProductTransport[]>;
    getProductTransportById(productTransportId: number): Promise<ProductTransport>;
    createProductTransport(createProductTransportDTO: CreateProductTransportDTO): Promise<ProductTransport>;
    updateProductTransport(productTransportId: number, updateProductTransportDTO: UpdateProductTransportDTO): Promise<ProductTransport>;
    removeProductTransport(productTransportId: number): Promise<ProductTransport>;
    changeProductTransportStatus(productTransportId: number): Promise<ProductTransport>;
}
