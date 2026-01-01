import { BaseReceiveDTO } from './base-receive.dto';
import { CreateServiceLineDTO } from '../../common/dto';
import { CreateReceiveLineDTO } from './create-receive-line.dto';
export declare class CreateReveiveDTO extends BaseReceiveDTO {
    receiveLines: CreateReceiveLineDTO[];
    receiveServiceLines: CreateServiceLineDTO[];
}
