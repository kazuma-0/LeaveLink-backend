import { MigrationInterface, QueryRunner } from "typeorm";

export class update1674060079304 implements MigrationInterface {
    name = 'update1674060079304'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" RENAME COLUMN "fileLocation" TO "file"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" RENAME COLUMN "file" TO "fileLocation"`);
    }

}
