import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTypeColumnRevokedAtRefreshes21785421033944 implements MigrationInterface {
  name = "AlterTypeColumnRevokedAtRefreshes21785421033944";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
    await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
    await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" TIME`);
  }
}
