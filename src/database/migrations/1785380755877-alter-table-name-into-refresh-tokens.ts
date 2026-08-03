import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableNameIntoRefreshTokens1785380755877 implements MigrationInterface {
  name = "AlterTableNameIntoRefreshTokens1785380755877";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refreshes" ("id" uuid NOT NULL, "token_hash" character varying NOT NULL, "expires_at" character varying NOT NULL, "revoked_at" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "replaced_by_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "UQ_668e0e7ce31b3050d2fb814102b" UNIQUE ("token_hash"), CONSTRAINT "REL_10cf954c641bb826b68120dbc5" UNIQUE ("replaced_by_id"), CONSTRAINT "PK_9c00f3ae59a54e1f0402a20cae3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshes" ADD CONSTRAINT "FK_10cf954c641bb826b68120dbc5d" FOREIGN KEY ("replaced_by_id") REFERENCES "refreshes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshes" ADD CONSTRAINT "FK_7ff4045990bb1360108a6779b31" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshes" DROP CONSTRAINT "FK_7ff4045990bb1360108a6779b31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshes" DROP CONSTRAINT "FK_10cf954c641bb826b68120dbc5d"`,
    );
    await queryRunner.query(`DROP TABLE "refreshes"`);
  }
}
