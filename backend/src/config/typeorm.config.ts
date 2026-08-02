import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { entities } from './entities';

export const typeOrmConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: config.get<string>('database.host'),
  port: config.get<number>('database.port'),
  username: config.get<string>('database.user'),
  password: config.get<string>('database.password'),
  database: config.get<string>('database.name'),
  entities,
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
});
