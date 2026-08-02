import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Marks the existing Django-managed schema as the TypeORM baseline.
 * No DDL — tables already exist on the shared database.
 */
export class Baseline1754127900000 implements MigrationInterface {
  name = 'Baseline1754127900000';

  public async up(_queryRunner: QueryRunner): Promise<void> {}

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
