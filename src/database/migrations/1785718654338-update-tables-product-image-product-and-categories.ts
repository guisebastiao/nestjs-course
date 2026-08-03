import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTablesProductImageProductAndCategories1785718654338 implements MigrationInterface {
  name = "UpdateTablesProductImageProductAndCategories1785718654338";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "product_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "UQ_54f2e1dbf14cfa770f59f0aac8f" UNIQUE ("product_id", "category_id"), CONSTRAINT "PK_7069dac60d88408eea56fdc9e0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(120) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(1000), CONSTRAINT "PK_24dbc6126a28ff948da33f97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "available_quantity"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "category"`);
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "position" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`ALTER TABLE "product_images" ADD "alt_text" character varying(150)`);
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD "path" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "sku" character varying(30) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE ("sku")`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "slug" character varying(1200) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" ADD "brand" character varying(500) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" ADD "attributes" json`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "name" character varying(1000) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "description" text`);
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_8748b4a0e8de6d266f2bbcae7f6" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" ADD CONSTRAINT "FK_9148da8f26fc2c8e77a337e3112" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_9148da8f26fc2c8e77a337e3112"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_categories" DROP CONSTRAINT "FK_8748b4a0e8de6d266f2bbcae7f6"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "description" character varying(1000) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "name" character varying(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "attributes"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "brand"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "slug"`);
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327"`,
    );
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "sku"`);
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "path"`);
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "alt_text"`);
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "position"`);
    await queryRunner.query(
      `ALTER TABLE "products" ADD "category" character varying(100) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "products" ADD "available_quantity" integer NOT NULL`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "product_categories"`);
  }
}
