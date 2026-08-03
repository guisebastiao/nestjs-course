import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784721540190 implements MigrationInterface {
  name = "InitialSchema1784721540190";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_attributes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(1000) NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_4fa18fc5c893cb9894fc40ca921" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(1000) NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_1974264ea7265989af8392f63a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "price" numeric(10,2) NOT NULL, "available_quantity" integer NOT NULL, "description" character varying(1000) NOT NULL, "category" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unit_price" numeric(10,2) NOT NULL, "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_attributes" ADD CONSTRAINT "FK_f5a6700abd0494bae3032cf5bbd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" ADD CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_images" DROP CONSTRAINT "FK_4f166bb8c2bfcef2498d97b4068"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_attributes" DROP CONSTRAINT "FK_f5a6700abd0494bae3032cf5bbd"`,
    );
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TABLE "product_images"`);
    await queryRunner.query(`DROP TABLE "product_attributes"`);
  }
}
