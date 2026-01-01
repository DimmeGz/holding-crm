import { Repository } from 'typeorm';
import { LibsService } from '../../libs';
import { TransitLine } from './entities';
import { AddReceiveToTransitLineDTO, CreateTransitLinesDTO, ReceiveTransitLinesDTO } from './dto';
export declare class TransitService {
    private readonly transitLinesRepository;
    private readonly libsService;
    constructor(transitLinesRepository: Repository<TransitLine>, libsService: LibsService);
    private createBaseQueryBuilder;
    private applyTransitLineListSelect;
    getTransitLines(): Promise<TransitLine[]>;
    createTransitLine(createTransitLineDTO: CreateTransitLinesDTO): Promise<void>;
    removeTransitLines(shipmentId: number): Promise<void>;
    addReceiveToTransitLines(addReceiveDTO: AddReceiveToTransitLineDTO): Promise<void>;
    receiveTransitLines(receiveDTO: ReceiveTransitLinesDTO): Promise<void>;
    cancelReceiveTransitLines(receiveDTO: ReceiveTransitLinesDTO): Promise<void>;
    private updateTransitLinesQty;
}
