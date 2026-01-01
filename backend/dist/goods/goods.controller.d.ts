import { GoodsService } from './goods.service';
import { GetBatchDataResponseDTO, GetProductDataResponseDTO } from './dto';
export declare class GoodsController {
    private readonly goodsService;
    constructor(goodsService: GoodsService);
    getBatchData(batchId: number): Promise<GetBatchDataResponseDTO>;
    getProductData(productId: number): Promise<GetProductDataResponseDTO>;
}
