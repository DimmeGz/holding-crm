import { BaseReceiveDTO } from './base-receive.dto';
import { CreateServiceLineDTO, UpdateServiceLineDTO } from '../../common/dto';
import { CreateReceiveLineDTO } from './create-receive-line.dto';
import { UpdateReceiveLineDTO } from './update-receive-line.dto';
export declare class UpdateReceiveDTO extends BaseReceiveDTO {
    receiveLines: (CreateReceiveLineDTO | UpdateReceiveLineDTO)[];
    receiveServiceLines: (CreateServiceLineDTO | UpdateServiceLineDTO)[];
}
