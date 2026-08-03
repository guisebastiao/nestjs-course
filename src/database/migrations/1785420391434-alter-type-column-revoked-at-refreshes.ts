import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTypeColumnRevokedAtRefreshes1785420391434 implements MigrationInterface {
  name = "AlterTypeColumnRevokedAtRefreshes1785420391434";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
    await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" TIME`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
    await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" character varying`);
  }
}
