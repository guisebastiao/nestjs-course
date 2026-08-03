import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserRoles1785506328123 implements MigrationInterface {
  name = "CreateTableUserRoles1785506328123";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id"), CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "roles" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(`ALTER TABLE "roles" ADD "user_id" uuid NOT NULL`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
  }
}
