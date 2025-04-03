import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Receive } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class ReceiveService {
  constructor(
    @InjectRepository(Receive)
    private readonly receivesRepository: Repository<Receive>,
  ) {}

  async getReceives() {
    const receives = await this.receivesRepository
      .createQueryBuilder('receive')
      .leftJoin('receive.seller', 'seller')
      .leftJoin('receive.buyer', 'buyer')
      .leftJoin('receive.shipment', 'shipment')
      .orderBy('receive.id', 'DESC')
      .getMany();

    return receives;
  }
}
