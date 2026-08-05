import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustDatabase1785955175617 implements MigrationInterface {
  name = "AdjustDatabase1785955175617";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_95c93a584de49f0b0e13f753630"`,
    );
    await queryRunner.query(`ALTER TABLE "recover_passwords" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "categories" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "product_images" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "addresses" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug")`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name")`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_id" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "refreshes" DROP CONSTRAINT "UQ_668e0e7ce31b3050d2fb814102b"`,
    );
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "token_hash"`);
    await queryRunner.query(
      `ALTER TABLE "refreshes" ADD "token_hash" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshes" ADD CONSTRAINT "UQ_668e0e7ce31b3050d2fb814102b" UNIQUE ("token_hash")`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d" UNIQUE ("cart_id", "product_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "UQ_dba960dbfd8636893d3c7acb18d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshes" DROP CONSTRAINT "UQ_668e0e7ce31b3050d2fb814102b"`,
    );
    await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "token_hash"`);
    await queryRunner.query(`ALTER TABLE "refreshes" ADD "token_hash" character varying NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "refreshes" ADD CONSTRAINT "UQ_668e0e7ce31b3050d2fb814102b" UNIQUE ("token_hash")`,
    );
    await queryRunner.query(`ALTER TABLE "order_items" ALTER COLUMN "product_id" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09"`,
    );
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "addresses" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "product_images" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "deleted_at"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "addresses" ADD "userId" uuid`);
    await queryRunner.query(`ALTER TABLE "recover_passwords" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_95c93a584de49f0b0e13f753630" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
