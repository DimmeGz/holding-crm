import { Package } from '../../goods/entities';
import { AbstractServiceLineEntity } from './abstract-service-line.entity';
export declare class AbstractLineEntity extends AbstractServiceLineEntity {
    package: Package;
    packageId: number;
}
