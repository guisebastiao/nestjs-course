import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterNumberToStringRefreshToken1785344462156 implements MigrationInterface {
  name = "AlterNumberToStringRefreshToken1785344462156";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "expires_at"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "expires_at" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "revoked_at"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD "revoked_at" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "revoked_at"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "revoked_at" integer NOT NULL`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "expires_at"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "expires_at" integer NOT NULL`);
  }
}
