import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Additive unique index on reports_monthdata (company_id, month).
 * Cleans duplicate rows first (keeps highest id).
 */
export class UniqueMonthDataCompanyMonth1754230000000
  implements MigrationInterface
{
  name = 'UniqueMonthDataCompanyMonth1754230000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM reports_monthdata md
      USING reports_monthdata newer
      WHERE md.company_id = newer.company_id
        AND md.month = newer.month
        AND md.id < newer.id
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_reports_monthdata_company_month"
      ON reports_monthdata (company_id, month)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "UQ_reports_monthdata_company_month"
    `);
  }
}
