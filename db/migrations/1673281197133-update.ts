import { MigrationInterface, QueryRunner } from "typeorm";

export class update1673281197133 implements MigrationInterface {
    name = 'update1673281197133'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_1836ab5c99aaf083bfa2e83ebd6"`);
        await queryRunner.query(`ALTER TABLE "leave" DROP COLUMN "approvalsId"`);
        await queryRunner.query(`ALTER TABLE "approval" ADD "leaveId" uuid`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528" FOREIGN KEY ("leaveId") REFERENCES "leave"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP COLUMN "leaveId"`);
        await queryRunner.query(`ALTER TABLE "leave" ADD "approvalsId" uuid`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_1836ab5c99aaf083bfa2e83ebd6" FOREIGN KEY ("approvalsId") REFERENCES "approval"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
