import { MigrationInterface, QueryRunner } from "typeorm";

export class update1674050619129 implements MigrationInterface {
    name = 'update1674050619129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" ADD "fileLocation" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" DROP COLUMN "fileLocation"`);
    }

}
