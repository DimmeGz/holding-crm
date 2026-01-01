import { ReceiveService } from './receive.service';
import { CreateReveiveDTO, UpdateReceiveDTO } from './dto';
import { Receive } from './entities';
import { GetReceivesQueryDTO } from './dto/query-dto';
export declare class ReceiveController {
    private readonly receiveService;
    constructor(receiveService: ReceiveService);
    getReceives(query?: GetReceivesQueryDTO): Promise<Receive[]>;
    getReceiveById(receiveId: number): Promise<Receive>;
    createReceive(createReveiveDTO: CreateReveiveDTO): Promise<Receive>;
    updateReceive(receiveId: number, updateReceiveDTO: UpdateReceiveDTO): Promise<Receive>;
    removeReceive(receiveId: number): Promise<Receive>;
    changeShipmentStatus(receiveId: number): Promise<Receive>;
}
