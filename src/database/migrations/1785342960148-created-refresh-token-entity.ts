import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatedRefreshTokenEntity1785342960148 implements MigrationInterface {
    name = 'CreatedRefreshTokenEntity1785342960148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP CONSTRAINT "FK_b7d0034e48284d32f01191367b9"`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL, "token_hash" character varying NOT NULL, "expires_at" integer NOT NULL, "revoked_at" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "replaced_by_id" uuid, "user_id" uuid NOT NULL, CONSTRAINT "UQ_a7838d2ba25be1342091b6695f1" UNIQUE ("token_hash"), CONSTRAINT "REL_860225ddfe4588a6d26e31b0c2" UNIQUE ("replaced_by_id"), CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD CONSTRAINT "FK_b7d0034e48284d32f01191367b9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_860225ddfe4588a6d26e31b0c21" FOREIGN KEY ("replaced_by_id") REFERENCES "refresh_tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_860225ddfe4588a6d26e31b0c21"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP CONSTRAINT "FK_b7d0034e48284d32f01191367b9"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD CONSTRAINT "FK_b7d0034e48284d32f01191367b9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
