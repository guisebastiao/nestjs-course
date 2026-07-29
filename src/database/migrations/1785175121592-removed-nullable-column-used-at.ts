import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedNullableColumnUsedAt1785175121592 implements MigrationInterface {
    name = 'RemovedNullableColumnUsedAt1785175121592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recover_passwords" ALTER COLUMN "used_at" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "recover_passwords" ALTER COLUMN "used_at" SET NOT NULL`);
    }

}
