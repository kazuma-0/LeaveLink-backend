import { MigrationInterface, QueryRunner } from "typeorm";

export class update1673279669236 implements MigrationInterface {
    name = 'update1673279669236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_0dd89461f5e9b3cdb4ae54e30cb"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP COLUMN "leavesId"`);
        await queryRunner.query(`ALTER TABLE "leave" ADD "approvalsId" uuid`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_1836ab5c99aaf083bfa2e83ebd6" FOREIGN KEY ("approvalsId") REFERENCES "approval"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_1836ab5c99aaf083bfa2e83ebd6"`);
        await queryRunner.query(`ALTER TABLE "leave" DROP COLUMN "approvalsId"`);
        await queryRunner.query(`ALTER TABLE "approval" ADD "leavesId" uuid`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_0dd89461f5e9b3cdb4ae54e30cb" FOREIGN KEY ("leavesId") REFERENCES "leave"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
