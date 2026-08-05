import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAddresses1785929051268 implements MigrationInterface {
    name = 'CreateTableAddresses1785929051268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "addresses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "label" character varying(50), "street" character varying(255) NOT NULL, "number" character varying(10) NOT NULL, "neighborhood" character varying(100) NOT NULL, "city" character varying(150) NOT NULL, "state" character varying(150) NOT NULL, "country" character varying(150) NOT NULL, "complement" character varying(300), "is_default" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`);
        await queryRunner.query(`DROP TABLE "addresses"`);
    }

}
