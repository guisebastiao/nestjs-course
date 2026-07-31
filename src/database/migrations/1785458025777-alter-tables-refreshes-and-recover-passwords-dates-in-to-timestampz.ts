import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTablesRefreshesAndRecoverPasswordsDatesInToTimestampz1785458025777 implements MigrationInterface {
    name = 'AlterTablesRefreshesAndRecoverPasswordsDatesInToTimestampz1785458025777'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP CONSTRAINT "FK_b7d0034e48284d32f01191367b9"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "refreshes" DROP CONSTRAINT "FK_10cf954c641bb826b68120dbc5d"`);
        await queryRunner.query(`ALTER TABLE "refreshes" DROP CONSTRAINT "FK_7ff4045990bb1360108a6779b31"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP COLUMN "used_at"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD "used_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD CONSTRAINT "FK_b7d0034e48284d32f01191367b9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD CONSTRAINT "FK_10cf954c641bb826b68120dbc5d" FOREIGN KEY ("replaced_by_id") REFERENCES "refreshes"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD CONSTRAINT "FK_7ff4045990bb1360108a6779b31" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshes" DROP CONSTRAINT "FK_7ff4045990bb1360108a6779b31"`);
        await queryRunner.query(`ALTER TABLE "refreshes" DROP CONSTRAINT "FK_10cf954c641bb826b68120dbc5d"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`);
        await queryRunner.query(`ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP CONSTRAINT "FK_b7d0034e48284d32f01191367b9"`);
        await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "revoked_at"`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD "revoked_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP COLUMN "used_at"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD "used_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" DROP COLUMN "expires_at"`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD "expires_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD CONSTRAINT "FK_7ff4045990bb1360108a6779b31" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refreshes" ADD CONSTRAINT "FK_10cf954c641bb826b68120dbc5d" FOREIGN KEY ("replaced_by_id") REFERENCES "refreshes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_176b502c5ebd6e72cafbd9d6f70" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "recover_passwords" ADD CONSTRAINT "FK_b7d0034e48284d32f01191367b9" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
