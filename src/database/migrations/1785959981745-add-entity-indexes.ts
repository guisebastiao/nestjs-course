import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEntityIndexes1785959981745 implements MigrationInterface {
  name = "AddEntityIndexes1785959981745";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_recover_passwords_user_id" ON "recover_passwords"  ("user_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_user_roles_role_id" ON "user_roles"  ("role_id") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_product_categories_category_id" ON "product_categories"  ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_images_product_id" ON "product_images"  ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_items_product_id" ON "cart_items"  ("product_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_products_price" ON "products"  ("price") `);
    await queryRunner.query(`CREATE INDEX "IDX_products_user_id" ON "products"  ("user_id") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_items_product_id" ON "order_items"  ("product_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_order_items_order_id" ON "order_items"  ("order_id") `,
    );
    await queryRunner.query(`CREATE INDEX "IDX_orders_user_id" ON "orders"  ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_refreshes_user_id" ON "refreshes"  ("user_id") `);
    await queryRunner.query(
      `CREATE INDEX "IDX_addresses_user_id_is_default" ON "addresses"  ("user_id", "is_default") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_addresses_user_id_is_default"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_refreshes_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_orders_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_order_items_order_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_order_items_product_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_products_user_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_products_price"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cart_items_product_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_product_images_product_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_product_categories_category_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_roles_role_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_recover_passwords_user_id"`);
  }
}
