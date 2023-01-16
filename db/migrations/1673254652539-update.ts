import { MigrationInterface, QueryRunner } from "typeorm";

export class update1673254652539 implements MigrationInterface {
    name = 'update1673254652539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approval" RENAME COLUMN "isReigistrarApproved" TO "isRegistrarApproved"`);
        await queryRunner.query(`ALTER TYPE "public"."approval_isreigistrarapproved_enum" RENAME TO "approval_isregistrarapproved_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."approval_isregistrarapproved_enum" RENAME TO "approval_isreigistrarapproved_enum"`);
        await queryRunner.query(`ALTER TABLE "approval" RENAME COLUMN "isRegistrarApproved" TO "isReigistrarApproved"`);
    }

}
