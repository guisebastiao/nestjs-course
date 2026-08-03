import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueUserEmail1785151118209 implements MigrationInterface {
  name = "AddUniqueUserEmail1785151118209";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
  }
}
