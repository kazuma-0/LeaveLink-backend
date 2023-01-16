import { MigrationInterface, QueryRunner } from "typeorm";

export class update1673258016321 implements MigrationInterface {
    name = 'update1673258016321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP COLUMN "leaveId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" ADD "leaveId" uuid`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528" FOREIGN KEY ("leaveId") REFERENCES "leave"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
