import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnRevokedByNullableTrue1785344640716 implements MigrationInterface {
  name = "AlterColumnRevokedByNullableTrue1785344640716";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked_at" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked_at" SET NOT NULL`);
  }
}
