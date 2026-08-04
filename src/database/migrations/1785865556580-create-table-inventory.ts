import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableInventory1785865556580 implements MigrationInterface {
    name = 'CreateTableInventory1785865556580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "quantity_available" integer NOT NULL, "low_stock_threshold" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_92fc0c77bab4a656b9619322c6" UNIQUE ("product_id"), CONSTRAINT "PK_7b1946392ffdcb50cfc6ac78c0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventories" ADD CONSTRAINT "FK_92fc0c77bab4a656b9619322c62" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventories" DROP CONSTRAINT "FK_92fc0c77bab4a656b9619322c62"`);
        await queryRunner.query(`DROP TABLE "inventories"`);
    }

}
