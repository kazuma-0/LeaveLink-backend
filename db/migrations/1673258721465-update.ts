import { MigrationInterface, QueryRunner } from "typeorm";

export class update1673258721465 implements MigrationInterface {
    name = 'update1673258721465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" ADD "leavesId" uuid`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_0dd89461f5e9b3cdb4ae54e30cb" FOREIGN KEY ("leavesId") REFERENCES "leave"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_0dd89461f5e9b3cdb4ae54e30cb"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP COLUMN "leavesId"`);
    }

}
