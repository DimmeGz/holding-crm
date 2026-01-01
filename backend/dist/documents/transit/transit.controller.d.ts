import { TransitService } from './transit.service';
import { TransitLine } from './entities';
export declare class TransitController {
    private readonly transitService;
    constructor(transitService: TransitService);
    getTransitLines(): Promise<TransitLine[]>;
}
