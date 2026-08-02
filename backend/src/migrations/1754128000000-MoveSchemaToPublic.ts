import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Moves leftover tables from the accidental Django schema into public.
 * Note: Django Meta.db_table still points at ivan_igantiev_2557 — update
 * Django separately if that app still shares this database.
 */
export class MoveSchemaToPublic1754128000000 implements MigrationInterface {
  name = 'MoveSchemaToPublic1754128000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE ivan_igantiev_2557.documents_commissionpaymentline
      SET SCHEMA public
    `);
    await queryRunner.query(`
      ALTER TABLE ivan_igantiev_2557.warehouse_technicalprocess_service
      SET SCHEMA public
    `);
    await queryRunner.query(`
      ALTER TABLE ivan_igantiev_2557.core_userextender
      SET SCHEMA public
    `);

    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS ivan_igantiev_2557.documents_commissionpaymentline_id_seq
      SET SCHEMA public
    `);
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS ivan_igantiev_2557.warehouse_technicalprocess_service_id_seq
      SET SCHEMA public
    `);

    await queryRunner.query(`DROP SCHEMA ivan_igantiev_2557 RESTRICT`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA ivan_igantiev_2557`);

    await queryRunner.query(`
      ALTER TABLE public.documents_commissionpaymentline
      SET SCHEMA ivan_igantiev_2557
    `);
    await queryRunner.query(`
      ALTER TABLE public.warehouse_technicalprocess_service
      SET SCHEMA ivan_igantiev_2557
    `);
    await queryRunner.query(`
      ALTER TABLE public.core_userextender
      SET SCHEMA ivan_igantiev_2557
    `);

    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS public.documents_commissionpaymentline_id_seq
      SET SCHEMA ivan_igantiev_2557
    `);
    await queryRunner.query(`
      ALTER SEQUENCE IF EXISTS public.warehouse_technicalprocess_service_id_seq
      SET SCHEMA ivan_igantiev_2557
    `);
  }
}
