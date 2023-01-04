import { MigrationInterface, QueryRunner } from "typeorm";

export class update1672831719499 implements MigrationInterface {
    name = 'update1672831719499'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "branch" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "UQ_d6d14945d4352867ecc62bcf85c" UNIQUE ("name"), CONSTRAINT "PK_2e39f426e2faefdaa93c5961976" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "facultyId" integer NOT NULL, CONSTRAINT "UQ_471da4b90e96c1ebe0af221e07b" UNIQUE ("name"), CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "faculties" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_39747c4153c669f1db683e8f231" UNIQUE ("name"), CONSTRAINT "PK_fd83e4a09c7182ccf7bdb3770b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('REGISTRAR', 'RESIDENT_DIRECTOR', 'DEAN', 'HEAD_OF_DEPARTMENT', 'STAFF', 'STUDENT')`);
        await queryRunner.query(`CREATE TABLE "user" ("name" character varying NOT NULL, "user_id" character varying NOT NULL, "date_of_birth" character varying NOT NULL, "password" character varying NOT NULL, "branchId" integer, "departmentId" integer, "role" "public"."user_role_enum" NOT NULL, "facultyId" integer, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "leave" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "casualLeaves" integer NOT NULL DEFAULT '0', "compensationLeaves" integer NOT NULL DEFAULT '0', "onDutyLeaves" integer NOT NULL DEFAULT '0', "permissionLeaves" integer NOT NULL DEFAULT '0', "month" integer NOT NULL, "year" integer NOT NULL, CONSTRAINT "PK_501f6ea368365d2a40b1660e16b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."approval_leavesession_enum" AS ENUM('FORENOON', 'AFTERNOON', 'FULLDAY')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_leavetype_enum" AS ENUM('CASUAL', 'PERMISSION', 'ON_DUTY', 'COMPENSATION')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_isreigistrarapproved_enum" AS ENUM('APPROVED', 'REJECTED', 'NOT_CHECKED', 'NO_PRIVILEGE', 'PENDING')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_isresidentdirectorapproved_enum" AS ENUM('APPROVED', 'REJECTED', 'NOT_CHECKED', 'NO_PRIVILEGE', 'PENDING')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_isdeanapproved_enum" AS ENUM('APPROVED', 'REJECTED', 'NOT_CHECKED', 'NO_PRIVILEGE', 'PENDING')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_ishodapproved_enum" AS ENUM('APPROVED', 'REJECTED', 'NOT_CHECKED', 'NO_PRIVILEGE', 'PENDING')`);
        await queryRunner.query(`CREATE TYPE "public"."approval_isstaffapproved_enum" AS ENUM('APPROVED', 'REJECTED', 'NOT_CHECKED', 'NO_PRIVILEGE', 'PENDING')`);
        await queryRunner.query(`CREATE TABLE "approval" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "reason" character varying NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "leaveSession" "public"."approval_leavesession_enum" NOT NULL, "leaveType" "public"."approval_leavetype_enum" NOT NULL, "isReigistrarApproved" "public"."approval_isreigistrarapproved_enum" NOT NULL DEFAULT 'NOT_CHECKED', "isResidentDirectorApproved" "public"."approval_isresidentdirectorapproved_enum" NOT NULL DEFAULT 'NOT_CHECKED', "isDeanApproved" "public"."approval_isdeanapproved_enum" NOT NULL DEFAULT 'NOT_CHECKED', "isHodApproved" "public"."approval_ishodapproved_enum" NOT NULL DEFAULT 'NOT_CHECKED', "isStaffApproved" "public"."approval_isstaffapproved_enum" NOT NULL DEFAULT 'NOT_CHECKED', "isApproved" boolean NOT NULL DEFAULT false, "isRejected" boolean NOT NULL DEFAULT false, "leaveId" uuid, CONSTRAINT "PK_97bfd1cd9dff3c1302229da6b5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carry" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "days" integer NOT NULL DEFAULT '3', CONSTRAINT "REL_e2e2ae6a8a16bcffcdf266062e" UNIQUE ("user_id"), CONSTRAINT "PK_e8c76308be46da7da17715ba188" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "branch" ADD CONSTRAINT "FK_d4442a08664833f60c05a5a3595" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "department" ADD CONSTRAINT "FK_1548ea92c71a222352108c4126d" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8b17d5d91bf27d0a33fb80ade8f" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3d6915a33798152a079997cad28" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_848c0779e2423d52fd964bbb793" FOREIGN KEY ("facultyId") REFERENCES "faculties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "leave" ADD CONSTRAINT "FK_bd5bb1ea0d8b3498b0e52e51e65" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_d677c4995c462988eb7234992a9" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approval" ADD CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528" FOREIGN KEY ("leaveId") REFERENCES "leave"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carry" ADD CONSTRAINT "FK_e2e2ae6a8a16bcffcdf266062e7" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "carry" DROP CONSTRAINT "FK_e2e2ae6a8a16bcffcdf266062e7"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_7661ca5a2d0cef4ec43c4861528"`);
        await queryRunner.query(`ALTER TABLE "approval" DROP CONSTRAINT "FK_d677c4995c462988eb7234992a9"`);
        await queryRunner.query(`ALTER TABLE "leave" DROP CONSTRAINT "FK_bd5bb1ea0d8b3498b0e52e51e65"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_848c0779e2423d52fd964bbb793"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3d6915a33798152a079997cad28"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8b17d5d91bf27d0a33fb80ade8f"`);
        await queryRunner.query(`ALTER TABLE "department" DROP CONSTRAINT "FK_1548ea92c71a222352108c4126d"`);
        await queryRunner.query(`ALTER TABLE "branch" DROP CONSTRAINT "FK_d4442a08664833f60c05a5a3595"`);
        await queryRunner.query(`DROP TABLE "carry"`);
        await queryRunner.query(`DROP TABLE "approval"`);
        await queryRunner.query(`DROP TYPE "public"."approval_isstaffapproved_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_ishodapproved_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_isdeanapproved_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_isresidentdirectorapproved_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_isreigistrarapproved_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_leavetype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."approval_leavesession_enum"`);
        await queryRunner.query(`DROP TABLE "leave"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "faculties"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "branch"`);
    }

}
