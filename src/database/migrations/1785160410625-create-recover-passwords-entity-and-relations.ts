import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRecoverPasswordsEntityAndRelations1785160410625 implements MigrationInterface {
    name = 'CreateRecoverPasswordsEntityAndRelations1785160410625'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "recover_passwords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "used_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "UQ_171711e80065da1dd5008f19812" UNIQUE ("token"), CONSTRAINT "PK_09bd3f590be91f4d578fe104e5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD CONSTRAINT "FK_b7d0034e48284d32f01191367b9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP CONSTRAINT "FK_b7d0034e48284d32f01191367b9"`);
        await queryRunner.query(`DROP TABLE "recover_passwords"`);
    }

}
