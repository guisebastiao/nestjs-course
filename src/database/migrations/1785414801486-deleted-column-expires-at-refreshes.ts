import { MigrationInterface, QueryRunner } from "typeorm";

export class DeletedColumnExpiresAtRefreshes1785414801486 implements MigrationInterface {
    name = 'DeletedColumnExpiresAtRefreshes1785414801486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshes" DROP COLUMN "expires_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refreshes" ADD "expires_at" character varying NOT NULL`);
    }

}
