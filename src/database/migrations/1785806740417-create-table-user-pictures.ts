import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUserPictures1785806740417 implements MigrationInterface {
    name = 'CreateTableUserPictures1785806740417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_pictures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "alt_text" character varying(150), "path" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_a5fd3ccce3218b1f91da711eed" UNIQUE ("user_id"), CONSTRAINT "PK_c934d2869e34c5fdb8942f4f623" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_images" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "product_categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_pictures" ADD CONSTRAINT "FK_a5fd3ccce3218b1f91da711eed9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_pictures" DROP CONSTRAINT "FK_a5fd3ccce3218b1f91da711eed9"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_categories" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "created_at"`);
        await queryRunner.query(`DROP TABLE "user_pictures"`);
    }

}
